import { useState, useContext, useEffect } from "react";
import styles from "./App.module.scss";
import AllLists from "./components/AllLists/AllLists";
import List from "./components/List/List";
import { ViewState } from "./types";
import { ListsContext, ListsDispatchContext } from "./providers/ListProvider.tsx";
//@ts-expect-error Don't have types for IndexedDB yet
import { getLists } from './utils/indexeddb.js';

function App() {
  const [view, setView] = useState<ViewState>("allLists");
  const [currentListId, setCurrentListId] = useState<null | number>(null);
  const todosLists = useContext(ListsContext);
  const listsDispatch = useContext(ListsDispatchContext);

  const currentListIndex = function () {
    if (currentListId === null) {
      return;
    } else {
      return todosLists.findIndex((todoList) => todoList.id === currentListId)!;
    }
  };

  useEffect(() => {
    console.log('App useEffect firing');
    const abortObj = { abort: false };
    getLists(listsDispatch, abortObj);

    //return function has closure over abortObj
    return () => {
      console.log('useEffect cleanup firing');
      abortObj.abort = true;
    }

  }, [listsDispatch]);

  return (
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
  );
}

export default App;
