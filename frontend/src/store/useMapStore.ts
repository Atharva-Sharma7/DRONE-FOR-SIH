import { create } from 'zustand';

interface MapState {
  activeLayers: {
    rgb: boolean;
    ndvi: boolean;
    disease: boolean;
    elevation: boolean;
    flightPath: boolean;
  };
  selectedPredictionId: string | null;
  mapBounds: [number, number, number, number] | null;
  toggleLayer: (layer: keyof MapState['activeLayers']) => void;
  setSelectedPredictionId: (id: string | null) => void;
  setMapBounds: (bounds: [number, number, number, number] | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  activeLayers: {
    rgb: true,
    ndvi: false,
    disease: true,
    elevation: false,
    flightPath: false,
  },
  selectedPredictionId: null,
  mapBounds: null,
  toggleLayer: (layer) => 
    set((state) => ({ 
      activeLayers: { ...state.activeLayers, [layer]: !state.activeLayers[layer] } 
    })),
  setSelectedPredictionId: (selectedPredictionId) => set({ selectedPredictionId }),
  setMapBounds: (mapBounds) => set({ mapBounds }),
}));
