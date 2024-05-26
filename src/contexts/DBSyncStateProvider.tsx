import { useState } from "react";
import DBSyncStateContext from "./DBSyncStateContext";

type DBSyncStateProviderProps = { children: React.ReactNode }

export default function DBSyncStateProvider({ children }: DBSyncStateProviderProps) {
  const [ DBSyncState, setDBSyncState ] = useState(false);

  return (
    <DBSyncStateContext.Provider value={[DBSyncState, setDBSyncState]}>
      {children}
    </DBSyncStateContext.Provider>
  );
}