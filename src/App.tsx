import { useState } from "react";
import "./App.css";
import AllLists from "./components/AllLists";
import List from "./components/List";
import { ListViewState } from "./types";

function App() {
  const [listView, setListView] = useState<ListViewState>("allLists");
  const [currentListId, setCurrentListId] = useState(0);

  return <>{listView === "allLists" ? <AllLists handleSetListView={setListView} handleListChange={setCurrentListId} /> : <List listId={currentListId} />}</>;
}

export default App;
