import ListsProvider from "./ListsProvider";
import DBSyncStateProvider from "./DBSyncStateProvider";
import DBErrorProvider from "./DBErrorProvider";

type AppProviderProps = { children: React.ReactNode }

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <ListsProvider>
      <DBSyncStateProvider>
        <DBErrorProvider>
          { children }
        </DBErrorProvider>
      </DBSyncStateProvider>
    </ListsProvider>
  );
}