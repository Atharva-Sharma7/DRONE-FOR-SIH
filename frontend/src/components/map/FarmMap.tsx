'use client';
import React, { useEffect, useRef, useState } from 'react';
import Map, { Source, Layer, MapRef, NavigationControl, ScaleControl } from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMapStore } from '@/store/useMapStore';
import { WARANGA_CENTER, DEFAULT_ZOOM, DISEASE_COLORS } from '@/lib/constants';
import { DiseasePopup } from './DiseasePopup';

export default function FarmMap() {
  const mapRef = useRef<MapRef>(null);
  const { activeLayers, selectedPredictionId, setSelectedPredictionId } = useMapStore();
  const [popupInfo, setPopupInfo] = useState<any | null>(null);

  // Mock data for farm boundary
  const farmBoundary = {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [[[76.56, 20.54], [76.57, 20.54], [76.57, 20.56], [76.56, 20.56], [76.56, 20.54]]]
      }
    }]
  };

  // Mock disease polygons
  const diseaseData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { id: 'p1', disease_class: 'target_spot', severity: 'high', confidence: 92, area: 1.2 },
        geometry: {
          type: 'Polygon',
          coordinates: [[[76.562, 20.545], [76.564, 20.545], [76.564, 20.547], [76.562, 20.547], [76.562, 20.545]]]
        }
      }
    ]
  };

  const handleMapClick = (e: any) => {
    const features = e.features;
    if (features && features.length > 0) {
      const feature = features[0];
      if (feature.layer.id === 'disease-layer-fill') {
        setPopupInfo({
          lngLat: e.lngLat,
          properties: feature.properties
        });
        setSelectedPredictionId(feature.properties.id);
      }
    } else {
      setPopupInfo(null);
      setSelectedPredictionId(null);
    }
  };

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: WARANGA_CENTER.lng,
        latitude: WARANGA_CENTER.lat,
        zoom: DEFAULT_ZOOM
      }}
      mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      interactiveLayerIds={['disease-layer-fill']}
      onClick={handleMapClick}
      style={{ width: '100%', height: '100%' }}
      cursor={popupInfo ? 'pointer' : 'grab'}
    >
      <NavigationControl position="top-left" />
      <ScaleControl position="bottom-left" />

      {/* Boundary Layer */}
      <Source id="farm-boundary" type="geojson" data={farmBoundary as any}>
        <Layer 
          id="farm-boundary-line" 
          type="line" 
          paint={{ 'line-color': '#1a7a4a', 'line-width': 3 }} 
        />
      </Source>

      {/* Disease Layer */}
      {activeLayers.disease && (
        <Source id="disease-data" type="geojson" data={diseaseData as any}>
          <Layer 
            id="disease-layer-fill" 
            type="fill" 
            paint={{ 
              'fill-color': ['match', ['get', 'disease_class'], 
                'target_spot', DISEASE_COLORS.target_spot,
                'charcoal_rot', DISEASE_COLORS.charcoal_rot,
                '#ff0000'
              ],
              'fill-opacity': 0.6 
            }} 
          />
        </Source>
      )}

      {popupInfo && (
        <DiseasePopup 
          info={popupInfo} 
          onClose={() => { setPopupInfo(null); setSelectedPredictionId(null); }} 
        />
      )}
    </Map>
  );
}
