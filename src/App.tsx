import { useState, useReducer } from "react";
import styles from "./App.module.scss";
import AllLists from "./components/AllLists/AllLists";
import List from "./components/List/List";
import { todosListReducer } from "./utils.ts";
import { ViewState, HandleListTitleChangeType, HandleListItemChangeType, HandleRemoveList, HandleRemoveItem, HandleAddList, HandleAddItem } from "./types";
import { todoLists as initialTodos } from "./data";

function App() {
  const [view, setView] = useState<ViewState>("allLists");
  const [currentListId, setCurrentListId] = useState<null | number>(null);
  const [todosList, dispatch] = useReducer(todosListReducer, initialTodos);

  const currentList = function () {
    if (currentListId === null) {
      return todosList[0];
    } else {
      return todosList.find((todoList) => todoList.id === currentListId)!;
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
      setCurrentListId: setCurrentListId,
    });

    setView("singleList");
  };

  const handleAddItem: HandleAddItem = (listId) => {
    dispatch({
      type: "item-added",
      listId: listId,
    });
  };

  return (
    <main className={styles.appContainer}>
      <div className={styles.listWrapper}>
        {view === "allLists" ? (
          <AllLists onSetView={setView} onListSet={setCurrentListId} todosList={todosList} onRemoveList={handleRemoveList} onAddList={handleAddList} />
        ) : (
          <List onSetView={setView} list={currentList()} onListTitleChange={handleListTitleChange} onListItemChange={handleListItemChange} onRemoveItem={handleRemoveItem} onAddItem={handleAddItem} />
        )}
      </div>
    </main>
  );
}

export default App;
