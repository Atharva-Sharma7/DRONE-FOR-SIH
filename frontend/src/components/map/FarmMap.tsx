'use client';
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Map, { Source, Layer, MapRef, NavigationControl, ScaleControl, Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMapStore } from '@/store/useMapStore';
import { DISEASE_COLORS, WARANGA_CENTER } from '@/lib/constants';
import { DiseasePopup } from './DiseasePopup';
import { DroneMarker } from './DroneMarker';
import { PinBoundarySelector, PinCoord, FlightMode } from './PinBoundarySelector';
import { MapPin, Target } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

// ESRI World Imagery — free satellite tiles, no API key
const SATELLITE_STYLE = {
  version: 8 as const,
  glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
  sources: {
    'esri-satellite': {
      type: 'raster' as const,
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      ],
      tileSize: 256,
      attribution: 'Tiles © Esri — Source: Esri, Maxar, GeoEye, Earthstar Geographics',
      maxzoom: 18,
    },
    'esri-labels': {
      type: 'raster' as const,
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
      ],
      tileSize: 256,
      maxzoom: 18,
    }
  },
  layers: [
    { id: 'esri-satellite-layer', type: 'raster' as const, source: 'esri-satellite' },
    { id: 'esri-labels-layer', type: 'raster' as const, source: 'esri-labels', paint: { 'raster-opacity': 0.7 } },
  ]
};

// Default Farmland Pins in Waranga Farmlands
const DEFAULT_PINS: PinCoord[] = [
  { id: 1, label: 'NW Pin', lat: 21.0310, lng: 79.0280 },
  { id: 2, label: 'NE Pin', lat: 21.0310, lng: 79.0420 },
  { id: 3, label: 'SE Pin', lat: 21.0190, lng: 79.0420 },
  { id: 4, label: 'SW Pin', lat: 21.0190, lng: 79.0280 },
];

function isValidLat(lat: any): boolean {
  return typeof lat === 'number' && !isNaN(lat) && lat >= -89.9 && lat <= 89.9;
}
function isValidLng(lng: any): boolean {
  return typeof lng === 'number' && !isNaN(lng) && lng >= -179.9 && lng <= 179.9;
}

// Calculate polygon area in Hectares
function calculatePolygonAreaHa(pins: PinCoord[]): number {
  const valid = pins.filter(p => isValidLat(p.lat) && isValidLng(p.lng));
  if (valid.length < 3) return 0;

  const latFactor = 111320;
  const lngFactor = (40075000 * Math.cos((WARANGA_CENTER.lat * Math.PI) / 180)) / 360;

  let areaM2 = 0;
  for (let i = 0; i < valid.length; i++) {
    const j = (i + 1) % valid.length;
    const x1 = valid[i].lng * lngFactor;
    const y1 = valid[i].lat * latFactor;
    const x2 = valid[j].lng * lngFactor;
    const y2 = valid[j].lat * latFactor;
    areaM2 += x1 * y2 - x2 * y1;
  }
  const sqM = Math.abs(areaM2) / 2;
  return parseFloat((sqM / 10000).toFixed(2));
}

// Generate dynamic serpentine scan flight path inside 4-pin polygon
function generateDynamicFlightPath(pins: PinCoord[], mode: FlightMode): number[][] {
  const valid = pins.filter(p => isValidLat(p.lat) && isValidLng(p.lng));
  if (valid.length < 4) return [[79.0280, 21.0190], [79.0420, 21.0310]];

  const minLng = Math.min(...valid.map(p => p.lng));
  const maxLng = Math.max(...valid.map(p => p.lng));
  const minLat = Math.min(...valid.map(p => p.lat));
  const maxLat = Math.max(...valid.map(p => p.lat));

  if (mode === 'patrol') {
    return [
      [valid[0].lng, valid[0].lat],
      [valid[1].lng, valid[1].lat],
      [valid[2].lng, valid[2].lat],
      [valid[3].lng, valid[3].lat],
      [valid[0].lng, valid[0].lat],
    ];
  }

  if (mode === 'inspect') {
    const midLng = (minLng + maxLng) / 2;
    const midLat = (minLat + maxLat) / 2;
    const rLng = (maxLng - minLng) * 0.25;
    const rLat = (maxLat - minLat) * 0.25;
    const pts: number[][] = [];
    for (let a = 0; a <= 360; a += 30) {
      const rad = (a * Math.PI) / 180;
      pts.push([midLng + rLng * Math.cos(rad), midLat + rLat * Math.sin(rad)]);
    }
    return pts;
  }

  // Grid scan mode (default serpentine)
  const steps = 6;
  const lngStep = (maxLng - minLng) / steps;
  const path: number[][] = [];

  for (let i = 0; i <= steps; i++) {
    const currLng = minLng + i * lngStep;
    if (i % 2 === 0) {
      path.push([currLng, minLat]);
      path.push([currLng, maxLat]);
    } else {
      path.push([currLng, maxLat]);
      path.push([currLng, minLat]);
    }
  }

  return path;
}

export default function FarmMap() {
  const mapRef = useRef<MapRef>(null);
  const searchParams = useSearchParams();
  const { activeLayers, setSelectedPredictionId } = useMapStore();
  const [popupInfo, setPopupInfo] = useState<any | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // 4-Pin State & Modes
  const [pins, setPins] = useState<PinCoord[]>(DEFAULT_PINS);
  const [flightMode, setFlightMode] = useState<FlightMode>('scan');
  const [isPickMode, setIsPickMode] = useState(false);
  const [nextPickIndex, setNextPickIndex] = useState(0);

  // Calculated area in Hectares
  const calculatedAreaHa = useMemo(() => calculatePolygonAreaHa(pins), [pins]);

  // Dynamic Flight Path
  const dynamicFlightPath = useMemo(() => generateDynamicFlightPath(pins, flightMode), [pins, flightMode]);

  // Target coordinates from query params
  const targetLatRaw = searchParams?.get('lat') ? parseFloat(searchParams.get('lat')!) : null;
  const targetLngRaw = searchParams?.get('lng') ? parseFloat(searchParams.get('lng')!) : null;
  const targetLat = isValidLat(targetLatRaw) ? targetLatRaw : null;
  const targetLng = isValidLng(targetLngRaw) ? targetLngRaw : null;

  // Fly to target lat/lng on load
  useEffect(() => {
    if (mapLoaded && targetLat && targetLng && mapRef.current) {
      mapRef.current.flyTo({
        center: [targetLng, targetLat],
        zoom: 16,
        duration: 2000,
      });
    }
  }, [mapLoaded, targetLat, targetLng]);

  // Dynamic Custom Boundary & Sub-Zone Heatmaps based on active pins
  const customGeoJSON = useMemo(() => {
    const valid = pins.filter(p => isValidLat(p.lat) && isValidLng(p.lng));
    if (valid.length < 3) return null;

    const coords = valid.map(p => [p.lng, p.lat]);
    coords.push([valid[0].lng, valid[0].lat]);

    const minLng = Math.min(...valid.map(p => p.lng));
    const maxLng = Math.max(...valid.map(p => p.lng));
    const minLat = Math.min(...valid.map(p => p.lat));
    const maxLat = Math.max(...valid.map(p => p.lat));
    const w = maxLng - minLng;
    const h = maxLat - minLat;

    const subZones = [
      {
        type: 'Feature',
        properties: { name: 'Healthy Cotton Canopy', color: '#166534', opacity: 0.35 },
        geometry: {
          type: 'Polygon',
          coordinates: [[[minLng + w*0.1, minLat + h*0.5], [minLng + w*0.9, minLat + h*0.5], [minLng + w*0.9, minLat + h*0.9], [minLng + w*0.1, minLat + h*0.9], [minLng + w*0.1, minLat + h*0.5]]]
        }
      },
      {
        type: 'Feature',
        properties: { name: 'Mild Nitrogen Stress', color: '#84cc16', opacity: 0.35 },
        geometry: {
          type: 'Polygon',
          coordinates: [[[minLng + w*0.1, minLat + h*0.1], [minLng + w*0.5, minLat + h*0.1], [minLng + w*0.5, minLat + h*0.5], [minLng + w*0.1, minLat + h*0.5], [minLng + w*0.1, minLat + h*0.1]]]
        }
      },
      {
        type: 'Feature',
        properties: { name: 'Severe Charcoal Rot Hotspot', color: '#DC2626', opacity: 0.55 },
        geometry: {
          type: 'Polygon',
          coordinates: [[[minLng + w*0.6, minLat + h*0.15], [minLng + w*0.85, minLat + h*0.15], [minLng + w*0.85, minLat + h*0.4], [minLng + w*0.6, minLat + h*0.4], [minLng + w*0.6, minLat + h*0.15]]]
        }
      }
    ];

    return {
      boundary: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { name: 'Active Farmland Boundary' },
            geometry: { type: 'Polygon', coordinates: [coords] }
          }
        ]
      },
      subZones: {
        type: 'FeatureCollection',
        features: subZones
      },
      flightPath: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { mode: flightMode },
            geometry: { type: 'LineString', coordinates: dynamicFlightPath }
          }
        ]
      }
    };
  }, [pins, flightMode, dynamicFlightPath]);

  const handleApplyBoundary = () => {
    const validPins = pins.filter(p => isValidLat(p.lat) && isValidLng(p.lng));
    if (validPins.length >= 3 && mapRef.current) {
      const minLng = Math.min(...validPins.map((p) => p.lng));
      const maxLng = Math.max(...validPins.map((p) => p.lng));
      const minLat = Math.min(...validPins.map((p) => p.lat));
      const maxLat = Math.max(...validPins.map((p) => p.lat));

      mapRef.current.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        { padding: 80, duration: 1500 }
      );
    }
  };

  const handleResetPins = () => {
    setPins(DEFAULT_PINS);
    setFlightMode('scan');
    setIsPickMode(false);
    setNextPickIndex(0);
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [WARANGA_CENTER.lng, WARANGA_CENTER.lat],
        zoom: 14.5,
        duration: 1500,
      });
    }
  };

  const handlePinDragEnd = (index: number, evt: any) => {
    const newLng = evt.lngLat.lng;
    const newLat = evt.lngLat.lat;
    if (isValidLat(newLat) && isValidLng(newLng)) {
      const updated = [...pins];
      updated[index] = { ...updated[index], lat: newLat, lng: newLng };
      setPins(updated);
    }
  };

  const handleMapClick = useCallback((e: any) => {
    if (isPickMode) {
      const clickLat = e.lngLat.lat;
      const clickLng = e.lngLat.lng;
      if (isValidLat(clickLat) && isValidLng(clickLng)) {
        const updated = [...pins];
        updated[nextPickIndex] = {
          ...updated[nextPickIndex],
          lat: parseFloat(clickLat.toFixed(5)),
          lng: parseFloat(clickLng.toFixed(5)),
        };
        setPins(updated);
        setNextPickIndex((prev) => (prev + 1) % 4);
      }
      return;
    }

    const features = e.features;
    if (features && features.length > 0) {
      const feature = features[0];
      if (feature.layer.id === 'disease-fill') {
        setPopupInfo({ lngLat: e.lngLat, properties: feature.properties });
        setSelectedPredictionId(feature.properties.id);
      }
    } else {
      setPopupInfo(null);
      setSelectedPredictionId(null);
    }
  }, [isPickMode, nextPickIndex, pins, setSelectedPredictionId]);

  return (
    <div className="relative w-full h-full font-sans">
      {/* 4-Pin & Flight Mode Selector Control */}
      <PinBoundarySelector
        pins={pins}
        onPinsChange={setPins}
        onApplyBoundary={handleApplyBoundary}
        onReset={handleResetPins}
        isPickMode={isPickMode}
        onTogglePickMode={() => setIsPickMode(!isPickMode)}
        flightMode={flightMode}
        onFlightModeChange={setFlightMode}
        calculatedAreaHa={calculatedAreaHa}
      />

      <Map
        ref={mapRef}
        initialViewState={{
          longitude: (targetLng && isValidLng(targetLng)) ? targetLng : WARANGA_CENTER.lng,
          latitude: (targetLat && isValidLat(targetLat)) ? targetLat : WARANGA_CENTER.lat,
          zoom: targetLat ? 16 : 14.5,
          pitch: 0,
          bearing: 0,
        }}
        mapStyle={SATELLITE_STYLE as any}
        interactiveLayerIds={['disease-fill']}
        onClick={handleMapClick}
        onLoad={() => setMapLoaded(true)}
        style={{ width: '100%', height: '100%' }}
        cursor={isPickMode ? 'crosshair' : popupInfo ? 'pointer' : 'grab'}
        attributionControl={true}
      >
        <NavigationControl position="top-left" />
        <ScaleControl position="bottom-left" unit="metric" />

        {/* Dynamic 4-Pin Outer Boundary Polygon */}
        {customGeoJSON && (
          <Source id="custom-boundary" type="geojson" data={customGeoJSON.boundary}>
            <Layer
              id="custom-boundary-fill"
              type="fill"
              paint={{
                'fill-color': '#FBBF24',
                'fill-opacity': 0.12,
              }}
            />
            <Layer
              id="custom-boundary-line"
              type="line"
              paint={{
                'line-color': '#FBBF24',
                'line-width': 3,
              }}
            />
          </Source>
        )}

        {/* Dynamic Crop Health Sub-Zones */}
        {customGeoJSON && activeLayers.disease && (
          <Source id="sub-zones" type="geojson" data={customGeoJSON.subZones}>
            <Layer
              id="sub-zone-fill"
              type="fill"
              paint={{
                'fill-color': ['get', 'color'],
                'fill-opacity': ['get', 'opacity'],
              }}
            />
            <Layer
              id="sub-zone-outline"
              type="line"
              paint={{
                'line-color': '#ffffff',
                'line-width': 1.5,
                'line-dasharray': [2, 2],
              }}
            />
          </Source>
        )}

        {/* Dynamic Flight Path */}
        {customGeoJSON && activeLayers.flightPath && (
          <Source id="dynamic-flight" type="geojson" data={customGeoJSON.flightPath}>
            <Layer
              id="dynamic-flight-line"
              type="line"
              paint={{
                'line-color': flightMode === 'inspect' ? '#F59E0B' : flightMode === 'patrol' ? '#10B981' : '#60A5FA',
                'line-width': 2.5,
                'line-dasharray': [4, 2],
              }}
            />
          </Source>
        )}

        {/* 4 Corner Pin Markers (Draggable) */}
        {pins.map((p, idx) => {
          if (!isValidLat(p.lat) || !isValidLng(p.lng)) return null;
          return (
            <Marker
              key={p.id}
              longitude={p.lng}
              latitude={p.lat}
              anchor="bottom"
              draggable
              onDragEnd={(evt) => handlePinDragEnd(idx, evt)}
            >
              <div className="flex flex-col items-center group cursor-grab active:cursor-grabbing">
                <div className="bg-[var(--accent)] text-black font-bold font-mono text-[10px] px-1.5 py-0.5 rounded-md shadow-xl border border-black/30 flex items-center gap-1">
                  <span>Pin {p.id} ({p.label})</span>
                </div>
                <MapPin className="w-6 h-6 text-[var(--accent)] drop-shadow-xl fill-black/50" />
              </div>
            </Marker>
          );
        })}

        {/* Target Pin Marker (LiDAR Error Anomaly) */}
        {targetLat && targetLng && isValidLat(targetLat) && isValidLng(targetLng) && (
          <Marker longitude={targetLng} latitude={targetLat} anchor="center">
            <div className="relative flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-red-500/40 animate-ping absolute" />
              <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl border-2 border-white">
                <Target className="w-5 h-5 animate-pulse" />
              </div>
            </div>
          </Marker>
        )}

        {/* Drone Marker */}
        {activeLayers.telemetry && (
          <DroneMarker customPath={dynamicFlightPath} flightMode={flightMode} />
        )}

        {/* Disease Popup */}
        {popupInfo && (
          <DiseasePopup
            info={popupInfo}
            onClose={() => { setPopupInfo(null); setSelectedPredictionId(null); }}
          />
        )}
      </Map>
    </div>
  );
}
