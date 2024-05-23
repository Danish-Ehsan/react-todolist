import { useContext } from "react";
import { DBSyncStateContext } from "../providers/DBSyncStateProvider";
import useDBError from "./useDBError";

type DBSyncStateSetter = (value: React.SetStateAction<boolean>) => void;

export default function useDBSyncState(): [boolean, DBSyncStateSetter] {
  const DBSyncStateValue = useContext(DBSyncStateContext);

  if (DBSyncStateValue === null) {
    throw new Error('useDBSyncState was used outside of its Provider');
  }

  const [DBSyncState, setDBSyncState] = DBSyncStateValue;
  const [DBError] = useDBError();

  

  // Provide a custom setter function for DBSyncState state so that the value can't be changed to "true" if there is an existing DBError.
  const DBSyncStateSetter: DBSyncStateSetter = (value) => {
    console.log(DBError);
    if (DBError.error) {
      console.log('There is a DB Error');
      return;
    } else {
      console.log({value});
      setDBSyncState(value);
    }
  }

  return [DBSyncState, DBSyncStateSetter];
}