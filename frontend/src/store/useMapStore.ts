import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MapLayers {
  boundary:   boolean;
  disease:    boolean;
  ndvi:       boolean;
  terrain:    boolean;
  flightPath: boolean;
  telemetry:  boolean;
}

interface MapState {
  activeLayers: MapLayers;
  selectedPredictionId: string | null;
  toggleLayer: (layer: keyof MapLayers) => void;
  setSelectedPredictionId: (id: string | null) => void;
}

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      activeLayers: {
        boundary:   true,
        disease:    true,
        ndvi:       false,
        terrain:    false,
        flightPath: true,
        telemetry:  true,
      },
      selectedPredictionId: null,
      toggleLayer: (layer) =>
        set((state) => ({
          activeLayers: {
            ...state.activeLayers,
            [layer]: !state.activeLayers[layer],
          },
        })),
      setSelectedPredictionId: (id) => set({ selectedPredictionId: id }),
    }),
    { name: 'map-storage', partialize: (s) => ({ activeLayers: s.activeLayers }) }
  )
);
