import { useState, createContext } from "react";

type DBSyncStateProviderProps = { children: React.ReactNode }

export const DBSyncStateContext = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>] | null>(null);

export function DBSyncStateProvider({ children }: DBSyncStateProviderProps) {
  const [ DBSyncState, setDBSyncState ] = useState(false);

  return (
    <DBSyncStateContext.Provider value={[DBSyncState, setDBSyncState]}>
      {children}
    </DBSyncStateContext.Provider>
  );
}