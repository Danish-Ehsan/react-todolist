import { AllTodoLists, HandleListItemChangeType, HandleRemoveItem, HandleMarkItem } from "../../types";
import allListStyles from "../AllLists/AllLists.module.scss";
import listStyles from "../List/List.module.scss";
import TrashIcon from "../../assets/TrashIcon";

type ListItemProps = {
  listItem: AllTodoLists[0]["listItems"][0];
  listId: number;
  onListItemChange: HandleListItemChangeType;
  onRemoveItem: HandleRemoveItem;
  onMarkItem: HandleMarkItem;
};

export default function ListItem({ listItem, listId, onMarkItem, onListItemChange, onRemoveItem }: ListItemProps) {
  return (
    <div className={allListStyles.listRow} key={listItem.id.toString()}>
      <label className={listStyles.checkboxLabel}>
        <input className={listStyles.checkbox} type="checkbox" checked={listItem.completed} onChange={() => onMarkItem(listId, listItem.id, !listItem.completed)} />
        <span className={listStyles.customCheckmark}></span>
      </label>
      <textarea className={`${listStyles.listTextarea} ${listStyles.listItem} ${listItem.completed ? listStyles["is-completed"] : ""}`} rows={1} onChange={(e) => onListItemChange(listId, e.target.value, listItem.id)}>
        {listItem.itemName}
      </textarea>
      <button onClick={() => onRemoveItem(listId, listItem.id)} className={`${allListStyles.trashBtn} ${allListStyles["trashBtn--listItem"]}`}>
        <TrashIcon className={allListStyles.trashIcon} />
      </button>
    </div>
  );
}
