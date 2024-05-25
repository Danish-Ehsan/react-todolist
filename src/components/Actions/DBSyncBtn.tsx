import { useState } from "react";
import styles from "./Actions.module.scss";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import { AiOutlineLoading } from "react-icons/ai";
import useDBSyncState from "../../hooks/useDBSyncState";
import useDBError from "../../hooks/useDBError";
import ActionMenuWindow from "./ActionMenuWindow";
import { resyncDatabase } from "../../utils/indexeddb";
import useListsContext from "../../hooks/useListsContext";

export default function DBSyncBtn() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [DBSyncState, setDBSyncState] = useDBSyncState();
  const [DBError, setDBError] = useDBError();
  const [lists] = useListsContext();

  const btnIcon = DBError.error ? <IoMdClose/> : DBSyncState ? <IoMdCheckmark/> : <AiOutlineLoading/>;
  
  let btnClasses = `${styles.actionBtn} ${styles.DBSyncBtn}`;
  let panelContent;

  if (DBError.error) {
    btnClasses += ` ${styles.syncError}`;
    
    panelContent = 
      <div className={`${styles.actionMenu} ${styles.DBSyncMenu}`}>
        <p>There has been an error saving your lists. Click the button below to attempt to save again.</p>
        <button
          onClick={() => {
            resyncDatabase(lists)
              .then(() => {
                setDBError({ error: false, message: '' });
                setDBSyncState(true);
              });
          }}
        >
          Resync Database
        </button>
      </div>
  } else if (DBSyncState) {
    btnClasses += ` ${styles.synced}`;

    panelContent = 
      <div className={`${styles.actionMenu} ${styles.DBSyncMenu}`}>
        <p>Your lists are saved.</p>
      </div>
  } else {
    btnClasses += ` ${styles.syncing}`;

    panelContent = 
      <div className={`${styles.actionMenu} ${styles.DBSyncMenu}`}>
        <p>Your lists are attempting to save</p>
      </div>
  }

  return (
    <div className={styles.actionBtnWrap}>
      <p id="sync-button-label" className={styles.actionBtnTitle}>Saved</p>
      <button
        aria-labelledby="sync-button-label"
        className={btnClasses}
        onClick={() => setIsPanelOpen((value) => !value)}
      >
        {btnIcon}
      </button>
      {
        isPanelOpen &&
        <ActionMenuWindow>
          {panelContent}
        </ActionMenuWindow>
      }
    </div>
  );
}