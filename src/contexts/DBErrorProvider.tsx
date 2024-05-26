import { useState } from "react";
import { DBErrorProps } from "../types";
import DBErrorContext from "./DBErrorContext";

type DBErrorProviderProps = {
  children: React.ReactNode;
}

export default function DBErrorProvider({ children }: DBErrorProviderProps) {
  const [DBError, setDBError] = useState<DBErrorProps>({ error: false, message: '' });

  return (
    <DBErrorContext.Provider value={[DBError, setDBError]}>
      { children }
    </DBErrorContext.Provider>
  )
}