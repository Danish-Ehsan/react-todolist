import { useState } from "react";
import "./App.css";
import AllLists from "./components/AllLists";
import List from "./components/List";
import { ViewState, TodosList } from "./types";
import { todoLists as initialTodos } from "./data";

function App() {
  const [view, setView] = useState<ViewState>("allLists");
  const [currentListId, setCurrentListId] = useState(0);
  const [todosList, setTodosList] = useState<TodosList>(initialTodos);

  return <>{view === "allLists" ? <AllLists onSetView={setView} onListChange={setCurrentListId} todosList={todosList} /> : <List onSetView={setView} listId={currentListId} />}</>;
}

export default App;
