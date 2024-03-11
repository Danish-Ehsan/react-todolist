import { useState } from "react";
import "./App.css";
import AllLists from "./components/AllLists/AllLists";
import List from "./components/List/List";
import { ViewState, TodosList } from "./types";
import { todoLists as initialTodos } from "./data";

function App() {
  const [view, setView] = useState<ViewState>("allLists");
  const [currentListId, setCurrentListId] = useState<null | number>(null);
  const [todosList, setTodosList] = useState<TodosList>(initialTodos);

  const currentList = function () {
    if (currentListId !== null) {
      return todosList.find((todoList) => todoList.id === currentListId);
    } else {
      return todosList.find((todoList) => todoList.id === 1);
    }
  };

  return <>{view === "allLists" ? <AllLists onSetView={setView} onListSet={setCurrentListId} todosList={todosList} /> : <List onSetView={setView} list={currentList()} onListChange={setTodosList} />}</>;
}

export default App;
