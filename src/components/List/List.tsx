import { useState, useContext } from "react";
import ListItem from "../ListItem/ListItem";
import ListTitle from "../ListTitle/ListTitle";
import { ViewState } from "../../types";
import { ListsContext, ListsDispatchContext } from "../../providers/ListProvider";
import { createId } from "../../utils/general";
import { setDBListItem } from "../../utils/indexeddb";

type ListProps = {
  listIndex: number;
  onSetView: React.Dispatch<React.SetStateAction<ViewState>>;
};

export default function List({ listIndex, onSetView }: ListProps) {
  const [newListItemId, setNewListItemId] = useState<number | null>(null);
  const listsDispatch = useContext(ListsDispatchContext);
  const allLists = useContext(ListsContext);
  const list = allLists[listIndex];

  const listItemElems = list.listItems.map((listItem, index) => {
    return <ListItem listItem={listItem} listId={list.id} index={index} setNewListItemId={setNewListItemId} shouldAutoFocus={listItem.id === newListItemId} key={listItem.id.toString()} />;
  });

  return (
    <>
      <ListTitle list={list} setNewListItemId={setNewListItemId} />
      {listItemElems}
      <button className="button" 
        onClick={
          () => {
            const newId = createId();

            listsDispatch({
              type: "item-added",
              listId: list.id,
              itemId: newId
            });

            setNewListItemId(newId);

            setDBListItem({
              id: newId,
              listId: list.id,
              itemName: '',
              completed: false,
              timestamp: Date.now()
            });
          }
        }>
        + Add Item
      </button>
      <button
        className="button"
        onClick={() => {
          onSetView("allLists");

          if (list.listName === "Untitled" && list.listItems.length < 1) {
            listsDispatch({
              type: "list-removed",
              listId: list.id,
            });
          }
        }}
      >
        Show All Lists
      </button>
    </>
  );
}
