import DBSyncBtn from "./DBSyncBtn";
import styles from "./Actions.module.scss";
import SortBtn from "./SortBtn";
import { ViewState } from "../../types";

type ActionBarProps = {
  appView: ViewState;
  currentListId: number | null;
}

export default function ActionBar({appView, currentListId}: ActionBarProps) {

  return (
    <div className={styles.actionBar}>
      <SortBtn appView={appView} currentListId={currentListId} />
      <DBSyncBtn/>
    </div>
  );
}