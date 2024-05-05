import { useState, useContext } from "react";
import styles from "./App.module.scss";
import AllLists from "./components/AllLists/AllLists";
import List from "./components/List/List";
import { ViewState, HandleListTitleChangeType, HandleListItemChangeType, HandleRemoveList, HandleRemoveItem, HandleAddList, HandleAddItem, HandleMarkItem } from "./types";
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

  const handleListTitleChange: HandleListTitleChangeType = (listId, newTitle) => {
    dispatch({
      type: "title-changed",
      listId: listId,
      newTitle: newTitle,
    });
  };

  const handleListItemChange: HandleListItemChangeType = (listId, newItemName, itemId) => {
    dispatch({
      type: "item-changed",
      listId: listId,
      newItemName: newItemName,
      itemId: itemId,
    });
  };

  const handleRemoveList: HandleRemoveList = (listId) => {
    dispatch({
      type: "list-removed",
      listId: listId,
    });
  };

  const handleRemoveItem: HandleRemoveItem = (listId, itemId) => {
    dispatch({
      type: "item-removed",
      listId: listId,
      itemId: itemId,
    });
  };

  const handleAddList: HandleAddList = () => {
    dispatch({
      type: "list-added",
      listItemId: Date.now()
    });

    setView("singleList");
  };

  const handleAddItem: HandleAddItem = (listId, listItemId) => {
    dispatch({
      type: "item-added",
      listId,
      listItemId
    });
  };

  const handleMarkItem: HandleMarkItem = (listId, itemId, completed) => {
    dispatch({
      type: "item-marked",
      listId: listId,
      itemId: itemId,
      completed: completed,
    });
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
