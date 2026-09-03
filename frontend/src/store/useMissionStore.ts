import { create } from 'zustand';
import { Mission } from '@/types';

interface MissionState {
  missions: Mission[];
  selectedMissionId: string | null;
  isLoading: boolean;
  setMissions: (missions: Mission[]) => void;
  setSelectedMissionId: (id: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useMissionStore = create<MissionState>((set) => ({
  missions: [],
  selectedMissionId: null,
  isLoading: false,
  setMissions: (missions) => set({ missions }),
  setSelectedMissionId: (selectedMissionId) => set({ selectedMissionId }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
