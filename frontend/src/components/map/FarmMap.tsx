'use client';
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Map, { Source, Layer, MapRef, NavigationControl, ScaleControl, Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMapStore, BasemapType } from '@/store/useMapStore';
import { useAppStore } from '@/store/useAppStore';
import { DISEASE_COLORS, WARANGA_CENTER } from '@/lib/constants';
import { DiseasePopup } from './DiseasePopup';
import { DroneMarker } from './DroneMarker';
import { PinBoundarySelector, PinCoord, FlightMode } from './PinBoundarySelector';
import { GatParcelPopup, GatParcelData } from './GatParcelPopup';
import { MapMeasureControl, MeasurePoint } from './MapMeasureControl';
import { TimeMachineCompareControl } from './TimeMachineCompareControl';
import { QuickSprayModal } from '@/components/farmer/QuickSprayModal';
import { MapPin, Target, Eye, Sliders, X, Trash2 } from 'lucide-react';
import { MapCustomizationPanel } from './MapCustomizationPanel';
import { CustomFarmMarker } from '@/store/useMapStore';
import { useSearchParams } from 'next/navigation';

// ── Multi-Basemap MapLibre Styles (Free, Zero API Key Required) ──
const BASEMAP_STYLES: Record<BasemapType, any> = {
  bhuvan: {
    version: 8,
    sources: {
      'bhuvan-tiles': {
        type: 'raster',
        tiles: [
          'https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms?service=WMS&version=1.1.1&request=GetMap&layers=bhuvan:india3&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG:3857&format=image/png',
        ],
        tileSize: 256,
        attribution: '© ISRO NRSC Bhuvan National Geoportal',
        maxzoom: 19,
      },
      'sat-fallback': {
        type: 'raster',
        tiles: [
          'https://mt0.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
          'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
        ],
        tileSize: 256,
      },
    },
    layers: [
      { id: 'bhuvan-sat', type: 'raster', source: 'sat-fallback' },
      { id: 'bhuvan-vec', type: 'raster', source: 'bhuvan-tiles', paint: { 'raster-opacity': 0.88 } },
    ],
  },
  satellite: {
    version: 8,
    sources: {
      'satellite-tiles': {
        type: 'raster',
        tiles: [
          'https://mt0.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
          'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
          'https://mt2.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
          'https://mt3.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
        ],
        tileSize: 256,
        attribution: '© Google Satellite & Agricultural Imagery',
        maxzoom: 20,
      },
    },
    layers: [
      { id: 'base-sat', type: 'raster', source: 'satellite-tiles' },
    ],
  },
  osm: {
    version: 8,
    sources: {
      'osm-tiles': {
        type: 'raster',
        tiles: [
          'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
        ],
        tileSize: 256,
        attribution: '© OpenStreetMap contributors',
        maxzoom: 19,
      },
    },
    layers: [
      { id: 'base-osm', type: 'raster', source: 'osm-tiles' },
    ],
  },
  topo: {
    version: 8,
    sources: {
      'opentopomap': {
        type: 'raster',
        tiles: [
          'https://tile.opentopomap.org/{z}/{x}/{y}.png',
          'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
          'https://b.tile.opentopomap.org/{z}/{x}/{y}.png',
          'https://c.tile.opentopomap.org/{z}/{x}/{y}.png',
        ],
        tileSize: 256,
        attribution: '© OpenTopoMap contributors',
        maxzoom: 17,
      },
    },
    layers: [
      { id: 'base-topo', type: 'raster', source: 'opentopomap' },
    ],
  },
  thermal: {
    version: 8,
    sources: {
      'carto-dark': {
        type: 'raster',
        tiles: [
          'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
          'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
          'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
          'https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        ],
        tileSize: 256,
        attribution: '© CartoDB Dark, AgriDrone Thermal IR Simulated',
        maxzoom: 19,
      },
    },
    layers: [
      { id: 'base-thermal', type: 'raster', source: 'carto-dark' },
    ],
  },
};

// ── Official Cadastral 7/12 (Satbara) Gat Survey Land Parcels for Waranga ──
const GAT_PARCELS: GatParcelData[] = [
  {
    gatNumber: '142/A',
    subDivision: 'North Cotton Plot',
    khataNumber: 'KH-842',
    ownerName: 'Ramesh R. Patil',
    areaAcres: 18.5,
    areaGunthas: 20,
    areaHa: 7.48,
    cropType: 'BT Cotton (RCH-659)',
    soilType: 'Deep Black Vertisol',
    irrigationType: 'Borewell + Drip Irrigation',
    ndviScore: 0.74,
    healthStatus: 'healthy',
    centerLng: 79.0325,
    centerLat: 21.0280,
  },
  {
    gatNumber: '142/B',
    subDivision: 'South Cotton Plot',
    khataNumber: 'KH-843',
    ownerName: 'Ramesh R. Patil',
    areaAcres: 14.2,
    areaGunthas: 10,
    areaHa: 5.74,
    cropType: 'Hybrid Cotton (Bunny)',
    soilType: 'Medium Black Cotton',
    irrigationType: 'Canal Flow + Rainfed',
    ndviScore: 0.68,
    healthStatus: 'healthy',
    centerLng: 79.0325,
    centerLat: 21.0225,
  },
  {
    gatNumber: '143',
    subDivision: 'East Soybean Plot',
    khataNumber: 'KH-911',
    ownerName: 'Sunanda R. Patil',
    areaAcres: 22.0,
    areaGunthas: 0,
    areaHa: 8.90,
    cropType: 'Soybean (JS-335)',
    soilType: 'Clayey Vertisol',
    irrigationType: 'Farm Pond Sprinkler',
    ndviScore: 0.42,
    healthStatus: 'stress',
    centerLng: 79.0385,
    centerLat: 21.0275,
  },
  {
    gatNumber: '144',
    subDivision: 'West Mixed Pulses Plot',
    khataNumber: 'KH-912',
    ownerName: 'Suresh R. Patil',
    areaAcres: 12.8,
    areaGunthas: 32,
    areaHa: 5.21,
    cropType: 'Tur Pigeon Pea (BDN-711)',
    soilType: 'Alluvial Loam',
    irrigationType: 'Rainfed Kharif',
    ndviScore: 0.71,
    healthStatus: 'healthy',
    centerLng: 79.0385,
    centerLat: 21.0220,
  },
];

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

function calculatePolygonAreaHa(pins: PinCoord[]): number {
  const valid = pins.filter((p) => isValidLat(p.lat) && isValidLng(p.lng));
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

function generateDynamicFlightPath(pins: PinCoord[], mode: FlightMode): number[][] {
  const valid = pins.filter((p) => isValidLat(p.lat) && isValidLng(p.lng));
  if (valid.length < 4) return [[79.0280, 21.0190], [79.0420, 21.0310]];

  const minLng = Math.min(...valid.map((p) => p.lng));
  const maxLng = Math.max(...valid.map((p) => p.lng));
  const minLat = Math.min(...valid.map((p) => p.lat));
  const maxLat = Math.max(...valid.map((p) => p.lat));

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
  const { language } = useAppStore();
  const { 
    activeLayers, 
    basemap, 
    compareMode, 
    setCompareMode, 
    measureMode, 
    setMeasureMode,
    setSelectedPredictionId,
    pitch,
    highSunlightMode,
    parcelOutlineColor,
    parcelFillOpacity,
    customMarkers,
    customizationPanelOpen,
    setCustomizationPanelOpen,
    removeCustomMarker,
  } = useMapStore();

  const [selectedCustomMarker, setSelectedCustomMarker] = useState<CustomFarmMarker | null>(null);

  const [popupInfo, setPopupInfo] = useState<any | null>(null);
  const [selectedGatParcel, setSelectedGatParcel] = useState<GatParcelData | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // 4-Pin State & Modes
  const [pins, setPins] = useState<PinCoord[]>(DEFAULT_PINS);
  const [flightMode, setFlightMode] = useState<FlightMode>('scan');
  const [isPickMode, setIsPickMode] = useState(false);
  const [nextPickIndex, setNextPickIndex] = useState(0);

  // Measurement Tool State
  const [measurePoints, setMeasurePoints] = useState<MeasurePoint[]>([]);

  // Time-Machine Compare Progress (0 = Day 0 Pre-Spray, 100 = Day 7 Post-Spray)
  const [compareProgress, setCompareProgress] = useState(35);

  // 1-Tap Spray Modal State
  const [sprayModalData, setSprayModalData] = useState<{
    isOpen: boolean;
    targetField: string;
    targetDisease: string;
    recommendedMedicine: string;
  }>({
    isOpen: false,
    targetField: '',
    targetDisease: '',
    recommendedMedicine: '',
  });

  const calculatedAreaHa = useMemo(() => calculatePolygonAreaHa(pins), [pins]);
  const dynamicFlightPath = useMemo(() => generateDynamicFlightPath(pins, flightMode), [pins, flightMode]);

  // Target coordinates from query params
  const targetLatRaw = searchParams?.get('lat') ? parseFloat(searchParams.get('lat')!) : null;
  const targetLngRaw = searchParams?.get('lng') ? parseFloat(searchParams.get('lng')!) : null;
  const targetLat = isValidLat(targetLatRaw) ? targetLatRaw : null;
  const targetLng = isValidLng(targetLngRaw) ? targetLngRaw : null;

  useEffect(() => {
    if (mapLoaded && targetLat && targetLng && mapRef.current) {
      mapRef.current.flyTo({
        center: [targetLng, targetLat],
        zoom: 16,
        duration: 2000,
      });
    }
  }, [mapLoaded, targetLat, targetLng]);

  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      try {
        mapRef.current.getMap().setPitch(pitch);
      } catch (err) {
        // ignore pitch set errors before full load
      }
    }
  }, [pitch, mapLoaded]);

  // Dynamic Custom Boundary, Sub-Zones, NDVI, Elevation Contours & 7/12 Gat Parcels
  const mapData = useMemo(() => {
    const valid = pins.filter((p) => isValidLat(p.lat) && isValidLng(p.lng));
    if (valid.length < 3) return null;

    const coords = valid.map((p) => [p.lng, p.lat]);
    coords.push([valid[0].lng, valid[0].lat]);

    const minLng = Math.min(...valid.map((p) => p.lng));
    const maxLng = Math.max(...valid.map((p) => p.lng));
    const minLat = Math.min(...valid.map((p) => p.lat));
    const maxLat = Math.max(...valid.map((p) => p.lat));
    const w = maxLng - minLng;
    const h = maxLat - minLat;
    const midLng = (minLng + maxLng) / 2;
    const midLat = (minLat + maxLat) / 2;

    // Time-Machine interpolation: blend red infection to emerald green recovery
    const recoveryRatio = compareProgress / 100;
    const hotspotColor = recoveryRatio < 0.5 ? '#DC2626' : '#16A34A';
    const hotspotOpacity = 0.65 - recoveryRatio * 0.35;

    // 1. Cadastral 7/12 Gat Parcels GeoJSON
    const cadastralFeatures = [
      {
        type: 'Feature',
        properties: { 
          id: '142/A', 
          gatNumber: '142/A', 
          label: language === 'mr' ? 'गट १४२/अ (१८.५ एकर)' : language === 'hi' ? 'गट १४२/अ (१८.५ एकड़)' : 'Gat 142/A (18.5 Ac)', 
          crop: 'BT Cotton' 
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[[minLng, midLat], [midLng, midLat], [midLng, maxLat], [minLng, maxLat], [minLng, midLat]]]
        }
      },
      {
        type: 'Feature',
        properties: { 
          id: '142/B', 
          gatNumber: '142/B', 
          label: language === 'mr' ? 'गट १४२/ब (१४.२ एकर)' : language === 'hi' ? 'गट १४२/ब (१४.२ एकड़)' : 'Gat 142/B (14.2 Ac)', 
          crop: 'Hybrid Cotton' 
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[[minLng, minLat], [midLng, minLat], [midLng, midLat], [minLng, midLat], [minLng, minLat]]]
        }
      },
      {
        type: 'Feature',
        properties: { 
          id: '143', 
          gatNumber: '143', 
          label: language === 'mr' ? 'गट १४३ (२२.० एकर)' : language === 'hi' ? 'गट १४३ (२२.० एकड़)' : 'Gat 143 (22.0 Ac)', 
          crop: 'Soybean JS-335' 
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[[midLng, midLat], [maxLng, midLat], [maxLng, maxLat], [midLng, maxLat], [midLng, midLat]]]
        }
      },
      {
        type: 'Feature',
        properties: { 
          id: '144', 
          gatNumber: '144', 
          label: language === 'mr' ? 'गट १४४ (१२.८ एकर)' : language === 'hi' ? 'गट १४४ (१२.८ एकड़)' : 'Gat 144 (12.8 Ac)', 
          crop: 'Tur Pulses' 
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[[midLng, minLat], [maxLng, minLat], [maxLng, midLat], [midLng, midLat], [midLng, minLat]]]
        }
      }
    ];

    // 2. Continuous NDVI Heatmap Zones
    const ndviFeatures = [
      {
        type: 'Feature',
        properties: { ndvi: 0.82, color: '#15803D', label: 'Very Healthy (NDVI 0.82)' },
        geometry: {
          type: 'Polygon',
          coordinates: [[[minLng + w*0.05, minLat + h*0.55], [minLng + w*0.45, minLat + h*0.55], [minLng + w*0.45, minLat + h*0.95], [minLng + w*0.05, minLat + h*0.95], [minLng + w*0.05, minLat + h*0.55]]]
        }
      },
      {
        type: 'Feature',
        properties: { ndvi: 0.71, color: '#22C55E', label: 'Healthy Canopy (NDVI 0.71)' },
        geometry: {
          type: 'Polygon',
          coordinates: [[[minLng + w*0.05, minLat + h*0.05], [minLng + w*0.45, minLat + h*0.05], [minLng + w*0.45, minLat + h*0.45], [minLng + w*0.05, minLat + h*0.45], [minLng + w*0.05, minLat + h*0.05]]]
        }
      },
      {
        type: 'Feature',
        properties: { ndvi: 0.54, color: '#F59E0B', label: 'Moderate Stress (NDVI 0.54)' },
        geometry: {
          type: 'Polygon',
          coordinates: [[[minLng + w*0.55, minLat + h*0.05], [minLng + w*0.95, minLat + h*0.05], [minLng + w*0.95, minLat + h*0.45], [minLng + w*0.55, minLat + h*0.45], [minLng + w*0.55, minLat + h*0.05]]]
        }
      },
      {
        type: 'Feature',
        properties: { ndvi: 0.36, color: '#DC2626', label: 'Severe Rot Stress (NDVI 0.36)' },
        geometry: {
          type: 'Polygon',
          coordinates: [[[minLng + w*0.58, minLat + h*0.58], [minLng + w*0.88, minLat + h*0.58], [minLng + w*0.88, minLat + h*0.88], [minLng + w*0.58, minLat + h*0.88], [minLng + w*0.58, minLat + h*0.58]]]
        }
      }
    ];

    // 3. Elevation Contour Lines (meters above sea level)
    const contourFeatures = [
      { type: 'Feature', properties: { elev: '282 m' }, geometry: { type: 'LineString', coordinates: [[minLng, minLat + h*0.2], [minLng + w*0.3, minLat + h*0.25], [minLng + w*0.7, minLat + h*0.22], [maxLng, minLat + h*0.18]] } },
      { type: 'Feature', properties: { elev: '284 m' }, geometry: { type: 'LineString', coordinates: [[minLng, minLat + h*0.4], [minLng + w*0.35, minLat + h*0.45], [minLng + w*0.75, minLat + h*0.42], [maxLng, minLat + h*0.38]] } },
      { type: 'Feature', properties: { elev: '286 m' }, geometry: { type: 'LineString', coordinates: [[minLng, minLat + h*0.6], [minLng + w*0.4, minLat + h*0.65], [minLng + w*0.8, minLat + h*0.62], [maxLng, minLat + h*0.58]] } },
      { type: 'Feature', properties: { elev: '288 m' }, geometry: { type: 'LineString', coordinates: [[minLng, minLat + h*0.8], [minLng + w*0.45, minLat + h*0.85], [minLng + w*0.85, minLat + h*0.82], [maxLng, minLat + h*0.78]] } },
    ];

    // 4. Time-Machine Disease Hotspot with Dynamic Opacity & Color
    const diseaseFeatures = [
      {
        type: 'Feature',
        properties: {
          id: 'crit-rot-1',
          disease_class: 'charcoal_rot',
          severity: compareProgress > 60 ? 'mild' : 'severe',
          confidence: compareProgress > 60 ? 35 : 94,
          area: '1.4',
          color: hotspotColor,
          opacity: hotspotOpacity,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[[minLng + w*0.62, minLat + h*0.62], [minLng + w*0.85, minLat + h*0.62], [minLng + w*0.85, minLat + h*0.85], [minLng + w*0.62, minLat + h*0.85], [minLng + w*0.62, minLat + h*0.62]]]
        }
      }
    ];

    return {
      boundary: { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [coords] } }] },
      cadastral: { type: 'FeatureCollection', features: cadastralFeatures },
      ndvi: { type: 'FeatureCollection', features: ndviFeatures },
      contours: { type: 'FeatureCollection', features: contourFeatures },
      disease: { type: 'FeatureCollection', features: diseaseFeatures },
      flightPath: { type: 'FeatureCollection', features: [{ type: 'Feature', properties: { mode: flightMode }, geometry: { type: 'LineString', coordinates: dynamicFlightPath } }] },
    };
  }, [pins, flightMode, dynamicFlightPath, compareProgress, language]);

  // Measurement GeoJSON
  const measureGeoJSON = useMemo(() => {
    if (measurePoints.length === 0) return null;
    const coords = measurePoints.map((p) => [p.lng, p.lat]);

    const features: any[] = [
      {
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: coords }
      }
    ];

    if (measurePoints.length >= 3) {
      features.push({
        type: 'Feature',
        properties: {},
        geometry: { type: 'Polygon', coordinates: [[...coords, coords[0]]] }
      });
    }

    return { type: 'FeatureCollection', features };
  }, [measurePoints]);

  const handleApplyBoundary = () => {
    const validPins = pins.filter((p) => isValidLat(p.lat) && isValidLng(p.lng));
    if (validPins.length >= 3 && mapRef.current) {
      const minLng = Math.min(...validPins.map((p) => p.lng));
      const maxLng = Math.max(...validPins.map((p) => p.lng));
      const minLat = Math.min(...validPins.map((p) => p.lat));
      const maxLat = Math.max(...validPins.map((p) => p.lat));
      mapRef.current.fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: 80, duration: 1500 });
    }
  };

  const handleResetPins = () => {
    setPins(DEFAULT_PINS);
    setFlightMode('scan');
    setIsPickMode(false);
    setNextPickIndex(0);
    if (mapRef.current) {
      mapRef.current.flyTo({ center: [WARANGA_CENTER.lng, WARANGA_CENTER.lat], zoom: 14.5, duration: 1500 });
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
    // 1. Measure Mode: Add measurement vertex
    if (measureMode) {
      const clickLat = parseFloat(e.lngLat.lat.toFixed(5));
      const clickLng = parseFloat(e.lngLat.lng.toFixed(5));
      setMeasurePoints((prev) => [...prev, { lat: clickLat, lng: clickLng }]);
      return;
    }

    // 2. Pick Boundary Pin Mode
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

    // 3. Feature Click Detection (7/12 Gat Parcel or Disease Hotspot)
    const features = e.features;
    if (features && features.length > 0) {
      const feature = features[0];
      if (feature.layer.id === 'cadastral-parcels-fill' || feature.layer.id === 'cadastral-parcels-line') {
        const found = GAT_PARCELS.find((p) => p.gatNumber === feature.properties.gatNumber);
        if (found) {
          setSelectedGatParcel(found);
          setPopupInfo(null);
          return;
        }
      }

      if (feature.layer.id === 'disease-hotspots-fill') {
        setPopupInfo({ lngLat: e.lngLat, properties: feature.properties });
        setSelectedPredictionId(feature.properties.id);
        setSelectedGatParcel(null);
        return;
      }
    }

    setPopupInfo(null);
    setSelectedGatParcel(null);
    setSelectedPredictionId(null);
  }, [measureMode, isPickMode, nextPickIndex, pins, setSelectedPredictionId]);

  return (
    <div className="relative w-full h-full font-sans" style={{ filter: highSunlightMode ? "contrast(1.25) saturate(1.2) brightness(1.05)" : "none" }}>
      {/* 4-Pin Boundary Selector Control */}
      {!measureMode && !compareMode && (
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
      )}

      {/* Interactive Measure HUD */}
      {measureMode && (
        <MapMeasureControl
          points={measurePoints}
          onClear={() => setMeasurePoints([])}
          onClose={() => setMeasureMode(false)}
        />
      )}

      {/* Time-Machine Before/After Spray Comparison Slider HUD */}
      {compareMode && (
        <TimeMachineCompareControl
          progress={compareProgress}
          onProgressChange={setCompareProgress}
          onClose={() => setCompareMode(false)}
        />
      )}

      <Map
        ref={mapRef}
        initialViewState={{
          longitude: targetLng && isValidLng(targetLng) ? targetLng : WARANGA_CENTER.lng,
          latitude: targetLat && isValidLat(targetLat) ? targetLat : WARANGA_CENTER.lat,
          zoom: targetLat ? 16 : 14.5,
          pitch: 25, // 3D AgroGIS angle
          bearing: -10,
        }}
        mapStyle={BASEMAP_STYLES[basemap]}
        interactiveLayerIds={['disease-hotspots-fill', 'cadastral-parcels-fill']}
        onClick={handleMapClick}
        onLoad={() => setMapLoaded(true)}
        style={{ width: '100%', height: '100%' }}
        cursor={measureMode ? 'crosshair' : isPickMode ? 'crosshair' : popupInfo || selectedGatParcel ? 'pointer' : 'grab'}
        attributionControl={true}
      >
        <NavigationControl position="top-left" visualizePitch={true} />
        <ScaleControl position="bottom-left" unit="metric" />

        {/* ── Outer Boundary Polygon (Customizable Color & Fill) ── */}
        {mapData && activeLayers.boundary && (
          <Source id="outer-boundary" type="geojson" data={mapData.boundary}>
            <Layer
              id="outer-boundary-fill"
              type="fill"
              paint={{ 'fill-color': parcelOutlineColor || '#FBBF24', 'fill-opacity': parcelFillOpacity ?? 0.08 }}
            />
            <Layer
              id="outer-boundary-line"
              type="line"
              paint={{ 'line-color': parcelOutlineColor || '#FBBF24', 'line-width': 2.8 }}
            />
          </Source>
        )}

        {/* ── 7/12 Cadastral Gat Survey Parcels Layer ── */}
        {mapData && activeLayers.cadastral && (
          <Source id="cadastral-parcels" type="geojson" data={mapData.cadastral}>
            <Layer
              id="cadastral-parcels-fill"
              type="fill"
              paint={{
                'fill-color': '#3B82F6',
                'fill-opacity': 0.15,
              }}
            />
            <Layer
              id="cadastral-parcels-line"
              type="line"
              paint={{
                'line-color': '#60A5FA',
                'line-width': 2,
                'line-dasharray': [3, 2],
              }}
            />
          </Source>
        )}

        {/* ── Continuous NDVI Heatmap Layer ── */}
        {mapData && activeLayers.ndvi && (
          <Source id="ndvi-heatmap" type="geojson" data={mapData.ndvi}>
            <Layer
              id="ndvi-heatmap-fill"
              type="fill"
              paint={{
                'fill-color': ['get', 'color'],
                'fill-opacity': 0.45,
              }}
            />
          </Source>
        )}

        {/* ── Elevation Contours Layer ── */}
        {mapData && activeLayers.terrain && (
          <Source id="elevation-contours" type="geojson" data={mapData.contours}>
            <Layer
              id="elevation-contours-line"
              type="line"
              paint={{
                'line-color': '#38BDF8',
                'line-width': 1.8,
                'line-opacity': 0.8,
              }}
            />
          </Source>
        )}

        {/* ── Disease Hotspot Layer (With Dynamic Time-Machine Blend) ── */}
        {mapData && activeLayers.disease && (
          <Source id="disease-hotspots" type="geojson" data={mapData.disease}>
            <Layer
              id="disease-hotspots-fill"
              type="fill"
              paint={{
                'fill-color': ['get', 'color'],
                'fill-opacity': ['get', 'opacity'],
              }}
            />
            <Layer
              id="disease-hotspots-outline"
              type="line"
              paint={{
                'line-color': '#FFFFFF',
                'line-width': 2,
              }}
            />
          </Source>
        )}

        {/* ── Dynamic Flight Path ── */}
        {mapData && activeLayers.flightPath && (
          <Source id="dynamic-flight" type="geojson" data={mapData.flightPath}>
            <Layer
              id="dynamic-flight-line"
              type="line"
              paint={{
                'line-color': flightMode === 'inspect' ? '#F59E0B' : flightMode === 'patrol' ? '#10B981' : '#38BDF8',
                'line-width': 2.5,
                'line-dasharray': [4, 2],
              }}
            />
          </Source>
        )}

        {/* ── Active Measurement Drawing Layer ── */}
        {measureGeoJSON && (
          <Source id="measure-layer" type="geojson" data={measureGeoJSON}>
            <Layer
              id="measure-fill"
              type="fill"
              paint={{ 'fill-color': '#FBBF24', 'fill-opacity': 0.25 }}
            />
            <Layer
              id="measure-line"
              type="line"
              paint={{ 'line-color': '#F59E0B', 'line-width': 3, 'line-dasharray': [2, 2] }}
            />
          </Source>
        )}

                {/* ── Custom Farm Infrastructure Markers (POIs) ── */}
        {activeLayers.customPois && customMarkers.map((marker) => {
          if (!isValidLat(marker.lat) || !isValidLng(marker.lng)) return null;
          const iconEmoji = 
            marker.type === 'borewell' ? '💧' :
            marker.type === 'pond' ? '🌊' :
            marker.type === 'solarpump' ? '⚡' :
            marker.type === 'shed' ? '🏚️' :
            marker.type === 'trap' ? '🪤' :
            marker.type === 'polyhouse' ? '🌱' : '📍';

          return (
            <Marker
              key={marker.id}
              longitude={marker.lng}
              latitude={marker.lat}
              anchor="bottom"
            >
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCustomMarker(marker);
                }}
                className="flex flex-col items-center group cursor-pointer hover:scale-110 transition-transform"
              >
                <div className="bg-emerald-800 text-white font-bold font-mono text-[9px] px-1.5 py-0.5 rounded shadow-lg border border-white/40 flex items-center gap-1 whitespace-nowrap mb-0.5">
                  <span>{marker.label}</span>
                </div>
                <div className="w-7 h-7 rounded-full bg-emerald-600 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs">
                  {iconEmoji}
                </div>
              </div>
            </Marker>
          );
        })}

        {/* ── 4 Draggable Pin Markers ── */}
        {!measureMode && !compareMode && pins.map((p, idx) => {
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

        {/* ── Target Marker (If opened via alert or detection link) ── */}
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

        {/* ── Live Drone Marker + Telemetry Tracking ── */}
        {activeLayers.telemetry && (
          <DroneMarker customPath={dynamicFlightPath} flightMode={flightMode} />
        )}

        {/* ── 7/12 Satbara Gat Land Record Popup ── */}
        {selectedGatParcel && (
          <GatParcelPopup
            parcel={selectedGatParcel}
            onClose={() => setSelectedGatParcel(null)}
            onLaunchSpray={(parcel) => {
              setSprayModalData({
                isOpen: true,
                targetField: `Gat No. ${parcel.gatNumber} · ${parcel.subDivision}`,
                targetDisease: parcel.healthStatus === 'stress' ? 'Charcoal Rot Hotspot' : 'Preventive Bio-Protection',
                recommendedMedicine: 'Trichoderma viride bio-fungicide (1.4L spray mix)',
              });
              setSelectedGatParcel(null);
            }}
          />
        )}

        {/* ── Disease Detection Popup ── */}
        {popupInfo && (
          <DiseasePopup
            info={popupInfo}
            onClose={() => { setPopupInfo(null); setSelectedPredictionId(null); }}
          />
        )}
      </Map>

            {/* Map Customization Floating Control Panel */}
      <MapCustomizationPanel />

      {/* Map Customization Quick Toggle Button */}
      {!customizationPanelOpen && (
        <button
          onClick={() => setCustomizationPanelOpen(true)}
          className="absolute bottom-6 left-16 z-10 bg-[var(--surface)]/90 backdrop-blur-md text-[var(--text-primary)] hover:bg-[var(--accent)] hover:text-black border border-[var(--border)] px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg transition-all"
          title="Customize Map"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{language === 'mr' ? '🎨 सानुकूलित करा' : language === 'hi' ? '🎨 कस्टमाइज़ करें' : '🎨 Customize'}</span>
        </button>
      )}

      {/* Selected Custom Farm POI Info Popup */}
      {selectedCustomMarker && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-2xl w-80 font-sans">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {selectedCustomMarker.type === 'borewell' ? '💧' : selectedCustomMarker.type === 'pond' ? '🌊' : selectedCustomMarker.type === 'solarpump' ? '⚡' : '📍'}
              </span>
              <div>
                <h4 className="text-sm font-bold text-[var(--text-primary)]">{selectedCustomMarker.label}</h4>
                <span className="text-[10px] font-mono text-[var(--accent)] uppercase">{selectedCustomMarker.type}</span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedCustomMarker(null)} 
              className="text-[var(--text-muted)] hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {selectedCustomMarker.notes && (
            <p className="text-xs text-[var(--text-secondary)] mb-3">{selectedCustomMarker.notes}</p>
          )}
          <div className="text-[10px] font-mono text-[var(--text-muted)] mb-3">
            GPS: {selectedCustomMarker.lat.toFixed(5)}, {selectedCustomMarker.lng.toFixed(5)}
          </div>
          <button
            onClick={() => {
              removeCustomMarker(selectedCustomMarker.id);
              setSelectedCustomMarker(null);
            }}
            className="w-full py-1.5 px-3 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{language === 'mr' ? 'मार्कर हटवा' : language === 'hi' ? 'मार्कर हटाएं' : 'Remove Marker'}</span>
          </button>
        </div>
      )}

      {/* Quick Spray Modal triggered from Gat Parcel */}
      <QuickSprayModal
        isOpen={sprayModalData.isOpen}
        onClose={() => setSprayModalData((prev) => ({ ...prev, isOpen: false }))}
        targetField={sprayModalData.targetField}
        targetDisease={sprayModalData.targetDisease}
        recommendedMedicine={sprayModalData.recommendedMedicine}
      />
    </div>
  );
}
