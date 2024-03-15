import { ViewState, SingleTodoList, HandleListTitleChangeType, HandleListItemChangeType, HandleRemoveItem, HandleRemoveList, HandleAddItem } from "../../types";
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
};

export default function List({ list, onSetView, onListTitleChange, onListItemChange, onRemoveItem, onRemoveList, onAddItem }: ListProps) {
  const listItemElems = list.listItems.map((listItem) => {
    return (
      <div className={allListStyles.listRow} key={listItem.id.toString()}>
        <input className={`${styles.listInput} ${styles.listItem}`} type="text" value={listItem.itemName} onChange={(e) => onListItemChange(list.id, e.target.value, listItem.id)} />
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
