import { useState } from "react";
import useListsContext from "../../hooks/useListsContext";
import ActionMenuWindow from "./ActionMenuWindow";
import { ViewState } from "../../types";
import styles from "./Actions.module.scss";
import { BiSortAlt2 } from "react-icons/bi";

type SortBtnProps = {
  appView: ViewState;
  currentListId: number | null;
}

type SortDispatchType = 
  (orderby: 'name' | 'date', direction: 'asc' | 'desc') => void;

export default function SortBtn({appView, currentListId}: SortBtnProps) {
  const [, listsDispatch] = useListsContext();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const sortDispatch: SortDispatchType = (orderby, direction) => {
    // listsDispatch({
    //   type: appView === 'singleList' ? "listitems-reordered" : "lists-reordered",
    //   orderby: orderby,
    //   direction: direction,
    //   ...(appView === 'singleList' && { listId: currentListId })
    // });
    if (appView === "allLists") {
      listsDispatch({
        type: "lists-reordered",
        orderby: orderby,
        direction: direction
      });
    } else {
      listsDispatch({
        type: "listitems-reordered",
        orderby: orderby,
        direction: direction,
        listId: currentListId!
      });
    }
  }

  return (
    <div className={styles.actionBtnWrap}>
      <p id="sort-button-label" className={styles.actionBtnTitle}>Sort</p>
      <button
        aria-labelledby="sort-button-label"
        className={`${styles.actionBtn} ${styles.SortBtn}`}
        onClick={() => setIsPanelOpen((value) => !value)}
      >
        <BiSortAlt2/>
      </button>
      {
        isPanelOpen &&
        <ActionMenuWindow>
          <div className={`${styles.ActionMenu} ${styles.SortMenu}`}>
            <p className={styles.ActionBtnTitle}>Sort By Name</p>
            <div className={styles.ActionBtnGroup}>
              <button
                className={styles.SortBtn}
                onClick={() => {
                  sortDispatch('name', 'asc');
                }}
              >
                ASC
              </button>
              <button
                className={styles.SortBtn}
                onClick={() => {
                  sortDispatch('name', 'desc');
                }}
              >
                DESC
              </button>
            </div>
            <p className={styles.ActionBtnTitle}>Sort By Date</p>
            <div className={styles.ActionBtnGroup}>
              <button
                className={styles.SortBtn}
                onClick={() => {
                  sortDispatch('date', 'asc');
                }}
              >
                ASC
              </button>
              <button
                className={styles.SortBtn}
                onClick={() => {
                  sortDispatch('date', 'desc');
                }}
              >
                DESC
              </button>
            </div>
          </div>
        </ActionMenuWindow>
      }
    </div>
  );
}