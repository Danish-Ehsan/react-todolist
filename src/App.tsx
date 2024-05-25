import { useState, useEffect } from "react";
import styles from "./App.module.scss";
import AllLists from "./components/AllLists/AllLists";
import List from "./components/List/List";
import ActionBar from "./components/Actions/ActionBar";
import { ViewState } from "./types";
import useListsContext from "./hooks/useListsContext";
import { getDBLists } from './utils/indexeddb';
import useDBSyncState from "./hooks/useDBSyncState";

function App() {
  const [view, setView] = useState<ViewState>("allLists");
  const [currentListId, setCurrentListId] = useState<null | number>(null);
  const [todosLists, listsDispatch] = useListsContext();
  const [, setDBSyncState] = useDBSyncState();

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

    newLists.then((lists) => { 
      console.log('newLists promise succeeded');
      console.log(lists);

      if (!effectCancelled && lists) {
        listsDispatch({
          type: 'lists-loaded',
          lists
        });
      }

      setDBSyncState(true);
    })

    //return function has closure over abortObj
    return () => {
      effectCancelled = true;
      console.log('useEffect cleanup firing');
      abortObj.abort = true;
    }

  }, [listsDispatch, setDBSyncState]);

  return (
    <main className={styles.appContainer}>
      <ActionBar appView={view} currentListId={currentListId} />
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
