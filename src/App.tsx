import { useState, useContext } from "react";
import styles from "./App.module.scss";
import AllLists from "./components/AllLists/AllLists";
import List from "./components/List/List";
import { ViewState } from "./types";
import { ListsContext, ListsProvider } from "./providers/ListProvider.tsx";

function App() {
  const [view, setView] = useState<ViewState>("allLists");
  const [currentListId, setCurrentListId] = useState<null | number>(null);
  const todosLists = useContext(ListsContext);

  const currentListIndex = function () {
    if (currentListId === null) {
      return;
    } else {
      return todosLists.findIndex((todoList) => todoList.id === currentListId)!;
    }
  };

  return (
    <ListsProvider>
      <main className={styles.appContainer}>
        <div className={styles.listWrapper}>
          {view === "allLists" ? (
            <AllLists onSetView={setView} onSetCurrentListId={setCurrentListId} />
          ) : (
            <List
              listIndex={currentListIndex() || 0}
              onSetView={setView}
            />
          )}
        </div>
      </main>
    </ListsProvider>
  );
}

export default App;
