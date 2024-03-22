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
        <textarea className={`${styles.listTextarea} ${styles.listItem} ${listItem.completed ? styles["is-completed"] : ""}`} rows={1} onChange={(e) => onListItemChange(list.id, e.target.value, listItem.id)}>
          {listItem.itemName}
        </textarea>
        <button onClick={() => onRemoveItem(list.id, listItem.id)} className={`${allListStyles.trashBtn} ${allListStyles["trashBtn--listItem"]}`}>
          <TrashIcon className={allListStyles.trashIcon} />
        </button>
      </div>
    );
  });

  return (
    <>
      <textarea
        className={`${styles.listTitle} ${styles.listTextarea}`}
        rows={1}
        onChange={(e) => {
          onListTitleChange(list.id, e.target.value);
        }}
      >
        {list?.listName}
      </textarea>
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
