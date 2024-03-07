import { useState } from "react";
import "./App.css";
import AllLists from "./components/AllLists";
import List from "./components/List";
import { ViewState } from "./types";

function App() {
  const [view, setView] = useState<ViewState>("allLists");
  const [currentListId, setCurrentListId] = useState(0);

  return <>{view === "allLists" ? <AllLists onSetView={setView} onListChange={setCurrentListId} /> : <List onSetView={setView} listId={currentListId} />}</>;
}

export default App;
