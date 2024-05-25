import { useState } from "react";
import ListItem from "../ListItem/ListItem";
import ListTitle from "../ListTitle/ListTitle";
import { ViewState } from "../../types";
import useListsContext from "../../hooks/useListsContext";
import { createId } from "../../utils/general";
import { createDBListItem, deleteDBList } from "../../utils/indexeddb";
import useDBSyncState from "../../hooks/useDBSyncState";

type ListProps = {
  listIndex: number;
  onSetView: React.Dispatch<React.SetStateAction<ViewState>>;
};

export default function List({ listIndex, onSetView }: ListProps) {
  const [newListItemId, setNewListItemId] = useState<number | null>(null);
  const [, setDBSyncState] = useDBSyncState();
  const [allLists, listsDispatch] = useListsContext();
  const list = allLists[listIndex];

  const incompleteListItemElems: JSX.Element[] = [];
  const completedListItemElems: JSX.Element[] = [];

  list.listItems.forEach((listItem, index) => {
    if (listItem.completed) {
      completedListItemElems.push(<ListItem listItem={listItem} listId={list.id} index={index} listIndex={listIndex} setNewListItemId={setNewListItemId} shouldAutoFocus={listItem.id === newListItemId} key={listItem.id.toString()} />);
    } else {
      incompleteListItemElems.push(<ListItem listItem={listItem} listId={list.id} index={index} listIndex={listIndex} setNewListItemId={setNewListItemId} shouldAutoFocus={listItem.id === newListItemId} key={listItem.id.toString()} />);
    }
  });

  return (
    <>
      <ListTitle list={list} setNewListItemId={setNewListItemId} />
      {incompleteListItemElems}
      {completedListItemElems}
      <button className="button" 
        onClick={
          () => {
            const newId = createId();
            const newTimestamp = Date.now();
            setDBSyncState(false);

            listsDispatch({
              type: "item-added",
              listId: list.id,
              itemId: newId,
              timestamp: newTimestamp
            });

            setNewListItemId(newId);

            createDBListItem({
              id: newId,
              listId: list.id,
              itemName: '',
              completed: false,
              timestamp: newTimestamp,
              order: list.listItems.length
            })
              .then(() => setDBSyncState(true));
          }
        }>
        + Add Item
      </button>
      <button
        className="button"
        onClick={() => {
          onSetView("allLists");

          if (list.listName === "" && list.listItems.length < 1) {
            setDBSyncState(false);

            listsDispatch({
              type: "list-removed",
              listId: list.id,
            });

            deleteDBList(list.id)
              .then(() => setDBSyncState(true));
          }
        }}
      >
        Show All Lists
      </button>
    </>
  );
}
