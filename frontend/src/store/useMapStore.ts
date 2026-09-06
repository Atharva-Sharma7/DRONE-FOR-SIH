import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BasemapType = 'satellite' | 'bhuvan' | 'osm' | 'topo' | 'thermal';

export interface CustomFarmMarker {
  id: string;
  type: 'borewell' | 'pond' | 'solarpump' | 'shed' | 'trap' | 'polyhouse' | 'other';
  label: string;
  notes?: string;
  lng: number;
  lat: number;
  createdAt: string;
}

export interface MapLayers {
  boundary:   boolean;
  disease:    boolean;
  ndvi:       boolean;
  terrain:    boolean;
  flightPath: boolean;
  telemetry:  boolean;
  cadastral:  boolean; // 7/12 Gat Survey Numbers
  cameraFov:  boolean; // Live Drone Gimbal Camera Footprint
  customPois: boolean; // Farmer custom added markers
}

interface MapState {
  activeLayers: MapLayers;
  basemap: BasemapType;
  compareMode: boolean; // Time-machine before/after spray slider
  measureMode: boolean; // Interactive distance/area measurement
  customizationPanelOpen: boolean;
  pitch: number; // 0 (2D), 30 (AgroGIS), 60 (Drone 3D)
  highSunlightMode: boolean;
  parcelOutlineColor: string;
  parcelFillOpacity: number;
  customMarkers: CustomFarmMarker[];
  selectedPredictionId: string | null;
  selectedGatNumber: string | null;
  toggleLayer: (layer: keyof MapLayers) => void;
  setBasemap: (basemap: BasemapType) => void;
  setCompareMode: (enabled: boolean) => void;
  setMeasureMode: (enabled: boolean) => void;
  setCustomizationPanelOpen: (open: boolean) => void;
  setPitch: (pitch: number) => void;
  toggleHighSunlightMode: () => void;
  setParcelOutlineColor: (color: string) => void;
  setParcelFillOpacity: (opacity: number) => void;
  addCustomMarker: (marker: CustomFarmMarker) => void;
  removeCustomMarker: (id: string) => void;
  setSelectedPredictionId: (id: string | null) => void;
  setSelectedGatNumber: (gat: string | null) => void;
}

const DEFAULT_CUSTOM_MARKERS: CustomFarmMarker[] = [
  {
    id: 'poi-1',
    type: 'borewell',
    label: 'Borewell #1 (३.५ HP मोटर)',
    notes: 'Depth 280ft · Water yield 2.2 inch · Primary drip connection',
    lng: 79.0345,
    lat: 21.0260,
    createdAt: '2026-06-15',
  },
  {
    id: 'poi-2',
    type: 'pond',
    label: 'Farm Pond / शेततळे (१० लाख लिटर)',
    notes: 'Micro-sprinkler reservoir with HDPE liner',
    lng: 79.0392,
    lat: 21.0285,
    createdAt: '2026-05-20',
  },
  {
    id: 'poi-3',
    type: 'solarpump',
    label: 'Kusum Solar Pump 5HP',
    notes: 'Dual-axis solar tracking with automated pressure regulator',
    lng: 79.0310,
    lat: 21.0240,
    createdAt: '2026-07-02',
  },
  {
    id: 'poi-4',
    type: 'trap',
    label: 'Pink Bollworm Pheromone Trap #4',
    notes: 'Installed in Gat 142/A · Lure changed 10 days ago',
    lng: 79.0330,
    lat: 21.0290,
    createdAt: '2026-08-01',
  },
];

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      activeLayers: {
        boundary:   true,
        disease:    true,
        ndvi:       true,
        terrain:    false,
        flightPath: true,
        telemetry:  true,
        cadastral:  true,
        cameraFov:  true,
        customPois: true,
      },
      basemap: 'satellite',
      compareMode: false,
      measureMode: false,
      customizationPanelOpen: false,
      pitch: 25,
      highSunlightMode: false,
      parcelOutlineColor: '#3B82F6',
      parcelFillOpacity: 0.15,
      customMarkers: DEFAULT_CUSTOM_MARKERS,
      selectedPredictionId: null,
      selectedGatNumber: null,
      toggleLayer: (layer) =>
        set((state) => ({
          activeLayers: {
            ...state.activeLayers,
            [layer]: !state.activeLayers[layer],
          },
        })),
      setBasemap: (basemap) => set({ basemap }),
      setCompareMode: (compareMode) => set({ compareMode }),
      setMeasureMode: (measureMode) => set({ measureMode }),
      setCustomizationPanelOpen: (customizationPanelOpen) => set({ customizationPanelOpen }),
      setPitch: (pitch) => set({ pitch }),
      toggleHighSunlightMode: () => set((s) => ({ highSunlightMode: !s.highSunlightMode })),
      setParcelOutlineColor: (parcelOutlineColor) => set({ parcelOutlineColor }),
      setParcelFillOpacity: (parcelFillOpacity) => set({ parcelFillOpacity }),
      addCustomMarker: (marker) =>
        set((s) => ({ customMarkers: [...s.customMarkers, marker] })),
      removeCustomMarker: (id) =>
        set((s) => ({ customMarkers: s.customMarkers.filter((m) => m.id !== id) })),
      setSelectedPredictionId: (id) => set({ selectedPredictionId: id }),
      setSelectedGatNumber: (gat) => set({ selectedGatNumber: gat }),
    }),
    { 
      name: 'map-storage-v2', 
      partialize: (s) => ({ 
        activeLayers: s.activeLayers, 
        basemap: s.basemap,
        customMarkers: s.customMarkers,
        parcelOutlineColor: s.parcelOutlineColor,
        parcelFillOpacity: s.parcelFillOpacity,
        pitch: s.pitch,
        highSunlightMode: s.highSunlightMode
      }) 
    }
  )
);
