import { ListsProvider } from "./ListProvider";

type AppProviderProps = { children: React.ReactNode }

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ListsProvider>
      { children }
    </ListsProvider>
  );
}