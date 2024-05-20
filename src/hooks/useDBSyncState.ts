import { useContext } from "react";
import { DBSyncStateContext  } from "../providers/DBSyncStateProvider";

export default function useDBSyncState() {
  const dbSyncState = useContext(DBSyncStateContext);

  if (!dbSyncState) {
    throw new Error('useDBSyncState was used outside of its Provider');
  }

  return dbSyncState;
}