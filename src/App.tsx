import { useState, useContext, useEffect } from "react";
import styles from "./App.module.scss";
import AllLists from "./components/AllLists/AllLists";
import List from "./components/List/List";
import { AllTodoLists, ViewState } from "./types";
import { ListsContext, ListsDispatchContext } from "./providers/ListProvider.tsx";
//@ts-expect-error Don't have types for IndexedDB yet
import { getDBLists } from './utils/indexeddb.js';

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
    const newLists = getDBLists(abortObj);
    let effectCancelled = false;

    newLists.then((lists: AllTodoLists) => { 
      console.log('newLists promise succeeded');
      console.log(lists);

      if (!effectCancelled) {
        listsDispatch({
          type: 'lists-loaded',
          lists
        });
      }
    })

    //return function has closure over abortObj
    return () => {
      effectCancelled = true;
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
