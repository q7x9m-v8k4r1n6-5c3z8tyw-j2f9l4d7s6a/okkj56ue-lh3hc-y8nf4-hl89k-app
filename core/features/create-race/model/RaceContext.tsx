import { createContext, useContext, useState, type ReactNode } from 'react';
import { type RacePayload } from './type';

interface RaceContextType {
  raceData: RacePayload;
  updateRaceData: (fields: Partial<RacePayload>) => void;
  resetRaceForm: () => void;
}

const initialData: RacePayload = {
  RaceID: '',
  RaceName: '',
  TimeStart: '',
  TimeEnd: '',
  Place: '',
  coverUrl: '',
  booths: [],
  teams: [],
  organizers: [],
  IsToggledLeaderboard: true,
  IsHiddenPoint: false
};

const RaceContext = createContext<RaceContextType | undefined>(undefined);

export const RaceProvider = ({ children }: { children: ReactNode }) => {
  const [raceData, setRaceData] = useState<RacePayload>(initialData);

  const updateRaceData = (fields: Partial<RacePayload>) => {
    setRaceData((prev) => ({ ...prev, ...fields }));
  };

  const resetRaceForm = () => setRaceData(initialData);

  return (
    <RaceContext.Provider value={{ raceData, updateRaceData, resetRaceForm }}>
      {children}
    </RaceContext.Provider>
  );
};

export const useRaceForm = () => {
  const context = useContext(RaceContext);
  if (!context) {
    throw new Error('Error');
  }
  return context;
};