import { ViewState, SingleTodoList, HandleListTitleChangeType, HandleListItemChangeType } from "../../types";
import styles from "./List.module.scss";

type listProps = {
  onSetView: React.Dispatch<React.SetStateAction<ViewState>>;
  list: SingleTodoList;
  onListTitleChange: HandleListTitleChangeType;
  onListItemChange: HandleListItemChangeType;
};

export default function List({ list, onSetView, onListTitleChange, onListItemChange }: listProps) {
  const listItemElems = list?.listItems.map((listItem) => {
    return <input className={`${styles.listInput} ${styles.listItem}`} type="text" value={listItem.itemName} key={listItem.id.toString()} onChange={(e) => onListItemChange(list.id, e.target.value, listItem.id)} />;
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
      <div>
        <button className="button" onClick={() => onSetView("allLists")}>
          Show All Lists
        </button>
      </div>
    </>
  );
}
