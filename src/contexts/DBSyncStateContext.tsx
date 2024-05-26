import { createContext } from "react";

const DBSyncStateContext = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>] | null>(null);

export default DBSyncStateContext;