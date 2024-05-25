import { useRef } from "react";
import styles from "../List/List.module.scss";
import useResizeTextarea from "../../hooks/useResizeTextarea";
import useListsContext from "../../hooks/useListsContext";
import { List } from "../../types";
import { updateDBList, createDBListItem } from "../../utils/indexeddb";
import { createId } from "../../utils/general";
import useDBSyncState from "../../hooks/useDBSyncState";

type ListTitleProps = {
  list: List;
  setNewListItemId: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function ListTitle({ list, setNewListItemId }: ListTitleProps) {
  const [, listsDispatch] = useListsContext();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const debounceTimeoutID = useRef<number | null>(null);
  const [, setDBSyncState] = useDBSyncState();

  useResizeTextarea(textareaRef, list.listName);

  return (
    <textarea
      className={`${styles.listTitle} ${styles.listTextarea}`}
      value={list.listName}
      rows={1}
      ref={textareaRef}
      placeholder="List Title"
      autoFocus={list.listName === ''}
      onKeyDown={
        //Create new list item if Enter is pressed without the shift key
        (e) => {
          console.log('onKeyDown firing');
          
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const newItemId = createId();
            const newTimestamp = Date.now();
            setDBSyncState(false);

            listsDispatch({
              type: "item-added",
              listId: list.id,
              itemId: newItemId,
              timestamp: newTimestamp
            });

            createDBListItem({
              id: newItemId,
              listId: list.id,
              itemName: '',
              completed: false,
              timestamp: newTimestamp,
              order: list.listItems.length
            })
              .then(() => setDBSyncState(true));

            setNewListItemId(newItemId);
          }
        }
      }
      onChange={(e) => {
        setDBSyncState(false);

        listsDispatch({
          type: "title-changed",
          listId: list.id,
          newTitle: e.target.value,
        });

        //Debounce database sync on user input
        if (debounceTimeoutID.current) {
          clearTimeout(debounceTimeoutID.current);
        }

        debounceTimeoutID.current = setTimeout(() => {
          console.log('list onChange debounce func firing');
          updateDBList({
            id: list.id,
            listName: e.target.value,
            timestamp: Date.now()
          })
            .then(() => setDBSyncState(true));
        }, 500);
      }}
    />
  );
}
