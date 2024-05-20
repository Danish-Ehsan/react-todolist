import { ListsProvider } from "./ListsProvider";
import { DBSyncStateProvider } from "./DBSyncStateProvider";

type AppProviderProps = { children: React.ReactNode }

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ListsProvider>
      <DBSyncStateProvider>
        { children }
      </DBSyncStateProvider>
    </ListsProvider>
  );
}