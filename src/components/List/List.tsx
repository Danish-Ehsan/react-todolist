import ListItem from "../ListItem/ListItem";
import ListTitle from "../ListTitle/ListTitle";
import { ViewState, AllTodoLists, HandleListTitleChangeType, HandleListItemChangeType, HandleRemoveItem, HandleRemoveList, HandleAddItem, HandleMarkItem } from "../../types";

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
      <ListTitle listTitle={list.listName} listId={list.id} onListTitleChange={onListTitleChange} />
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
