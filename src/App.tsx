import { useState } from "react";
import styles from "./App.module.scss";
import AllLists from "./components/AllLists/AllLists";
import List from "./components/List/List";
import { ViewState, AllTodoLists, HandleListTitleChangeType, HandleListItemChangeType } from "./types";
import { todoLists as initialTodos } from "./data";

function App() {
  const [view, setView] = useState<ViewState>("allLists");
  const [currentListId, setCurrentListId] = useState<null | number>(null);
  const [todosList, setTodosList] = useState<AllTodoLists>(initialTodos);

  const currentList = function () {
    if (currentListId === null) {
      return todosList[0];
    } else {
      return todosList.find((todoList) => todoList.id === currentListId)!;
    }
  };

  const handleListTitleChange: HandleListTitleChangeType = (listId, newTitle) => {
    setTodosList((allLists) => {
      const newLists = allLists.map((currentList) => {
        if (listId !== undefined && currentList.id === listId) {
          return {
            ...currentList,
            listName: newTitle,
          };
        } else {
          return currentList;
        }
      });

      return newLists;
    });
  };

  const handleListItemChange: HandleListItemChangeType = (listId, newItemName, itemId) => {
    setTodosList((allLists) => {
      const newLists = allLists.map((currentList) => {
        if (listId !== undefined && currentList.id === listId) {
          const newListItems = currentList.listItems.map((listItem) => {
            if (listItem.id === itemId) {
              return {
                ...listItem,
                itemName: newItemName,
              };
            } else {
              return listItem;
            }
          });
          return {
            ...currentList,
            listItems: newListItems,
          };
        } else {
          return currentList;
        }
      });

      return newLists;
    });
  };

  return (
    <main className={styles.appContainer}>
      <div className={styles.listWrapper}>
        {view === "allLists" ? <AllLists onSetView={setView} onListSet={setCurrentListId} todosList={todosList} /> : <List onSetView={setView} list={currentList()} onListTitleChange={handleListTitleChange} onListItemChange={handleListItemChange} />}
      </div>
    </main>
  );
}

export default App;
