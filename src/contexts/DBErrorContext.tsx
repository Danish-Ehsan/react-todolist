import { createContext } from "react";
import { DBErrorProps } from "../types";

const DBErrorContext = createContext<[DBErrorProps, React.Dispatch<React.SetStateAction<DBErrorProps>>] | null>(null);

export default DBErrorContext;