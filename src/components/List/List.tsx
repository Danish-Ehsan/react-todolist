import ListItem from "../ListItem/ListItem";
import { ViewState, AllTodoLists, HandleListTitleChangeType, HandleListItemChangeType, HandleRemoveItem, HandleRemoveList, HandleAddItem, HandleMarkItem } from "../../types";
import styles from "./List.module.scss";

type ListProps = {
  onSetView: React.Dispatch<React.SetStateAction<ViewState>>;
  list: AllTodoLists[0];
  onListTitleChange: HandleListTitleChangeType;
  onListItemChange: HandleListItemChangeType;
  onRemoveItem: HandleRemoveItem;
  onRemoveList: HandleRemoveList;
  onAddItem: HandleAddItem;
  onMarkItem: HandleMarkItem;
};

export default function List({ list, onSetView, onListTitleChange, onListItemChange, onRemoveItem, onRemoveList, onAddItem, onMarkItem }: ListProps) {
  const listItemElems = list.listItems.map((listItem) => {
    return <ListItem listItem={listItem} listId={list.id} onListItemChange={onListItemChange} onRemoveItem={onRemoveItem} onMarkItem={onMarkItem} key={listItem.id.toString()} />;
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
