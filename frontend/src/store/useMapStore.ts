import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BasemapType = 'satellite' | 'osm' | 'topo' | 'thermal';

export interface MapLayers {
  boundary:   boolean;
  disease:    boolean;
  ndvi:       boolean;
  terrain:    boolean;
  flightPath: boolean;
  telemetry:  boolean;
  cadastral:  boolean; // 7/12 Gat Survey Numbers
  cameraFov:  boolean; // Live Drone Gimbal Camera Footprint
}

interface MapState {
  activeLayers: MapLayers;
  basemap: BasemapType;
  compareMode: boolean; // Time-machine before/after spray slider
  measureMode: boolean; // Interactive distance/area measurement
  selectedPredictionId: string | null;
  selectedGatNumber: string | null;
  toggleLayer: (layer: keyof MapLayers) => void;
  setBasemap: (basemap: BasemapType) => void;
  setCompareMode: (enabled: boolean) => void;
  setMeasureMode: (enabled: boolean) => void;
  setSelectedPredictionId: (id: string | null) => void;
  setSelectedGatNumber: (gat: string | null) => void;
}

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
      },
      basemap: 'satellite',
      compareMode: false,
      measureMode: false,
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
      setSelectedPredictionId: (id) => set({ selectedPredictionId: id }),
      setSelectedGatNumber: (gat) => set({ selectedGatNumber: gat }),
    }),
    { 
      name: 'map-storage', 
      partialize: (s) => ({ activeLayers: s.activeLayers, basemap: s.basemap }) 
    }
  )
);
