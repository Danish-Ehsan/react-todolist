import { useState } from "react";
import DBSyncBtn from "./DBSyncBtn";
import styles from "./Actions.module.scss";
import SortBtn from "./SortBtn";
import { ViewState } from "../../types";

type ActionBarProps = {
  appView: ViewState;
  currentListId: number | null;
}

export default function ActionBar({appView, currentListId}: ActionBarProps) {
  const [activePanel, setActivePanel] = useState<number | null>(null);
  
  return (
    <div className={styles.actionBar}>
      <SortBtn isPanelOpen={activePanel === 1} setActivePanel={setActivePanel} appView={appView} currentListId={currentListId} />
      <DBSyncBtn isPanelOpen={activePanel === 2} setActivePanel={setActivePanel} />
    </div>
  );
}