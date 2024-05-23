import { createContext, useState } from "react";

type DBErrorProps = {
  error: boolean;
  message: string;
};

type DBErrorProviderProps = {
  children: React.ReactNode;
}

export const DBErrorContext = createContext<[DBErrorProps, React.Dispatch<React.SetStateAction<DBErrorProps>>] | null>(null);

export function DBErrorProvider({ children }: DBErrorProviderProps) {
  const [DBError, setDBError] = useState<DBErrorProps>({ error: false, message: '' });

  return (
    <DBErrorContext.Provider value={[DBError, setDBError]}>
      { children }
    </DBErrorContext.Provider>
  )
}