import { ViewState, SingleTodoList, HandleListTitleChangeType, HandleListItemChangeType, HandleRemoveItem, HandleRemoveList, HandleAddItem, HandleMarkItem } from "../../types";
import TrashIcon from "../../assets/TrashIcon";
import styles from "./List.module.scss";
import allListStyles from "../AllLists/AllLists.module.scss";

type ListProps = {
  onSetView: React.Dispatch<React.SetStateAction<ViewState>>;
  list: SingleTodoList;
  onListTitleChange: HandleListTitleChangeType;
  onListItemChange: HandleListItemChangeType;
  onRemoveItem: HandleRemoveItem;
  onRemoveList: HandleRemoveList;
  onAddItem: HandleAddItem;
  onMarkItem: HandleMarkItem;
};

export default function List({ list, onSetView, onListTitleChange, onListItemChange, onRemoveItem, onRemoveList, onAddItem, onMarkItem }: ListProps) {
  const listItemElems = list.listItems.map((listItem) => {
    return (
      <div className={allListStyles.listRow} key={listItem.id.toString()}>
        <label className={styles.checkboxLabel}>
          <input className={styles.checkbox} type="checkbox" checked={listItem.completed} onChange={() => onMarkItem(list.id, listItem.id, !listItem.completed)} />
          <span className={styles.customCheckmark}></span>
        </label>
        <input className={`${styles.listInput} ${styles.listItem} ${listItem.completed ? styles["is-completed"] : ""}`} type="text" value={listItem.itemName} onChange={(e) => onListItemChange(list.id, e.target.value, listItem.id)} />
        <button onClick={() => onRemoveItem(list.id, listItem.id)} className={allListStyles.trashBtn}>
          <TrashIcon className={allListStyles.trashIcon} />
        </button>
      </div>
    );
  });

  return (
    <>
      <input
        className={`${styles.listTitle} ${styles.listInput}`}
        type="text"
        value={list?.listName}
        onChange={(e) => {
          onListTitleChange(list.id, e.target.value);
        }}
      />
      {listItemElems}
      <button className="button" onClick={() => onAddItem(list.id)}>
        + Add Item
      </button>
      <button
        className="button"
        onClick={() => {
          onSetView("allLists");

          if (list.listName === "Untitled" && list.listItems.length < 1) {
            onRemoveList(list.id);
          }
        }}
      >
        Show All Lists
      </button>
    </>
  );
}
