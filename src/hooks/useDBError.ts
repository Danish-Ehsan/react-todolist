import { useContext } from "react";
import DBErrorContext from "../contexts/DBErrorContext";

export default function useDBError() {
  const DBErrorState = useContext(DBErrorContext);

  if (!DBErrorState) {
    throw new Error('useDBError muse be called inside of its Provider');
  }

  return DBErrorState;
}