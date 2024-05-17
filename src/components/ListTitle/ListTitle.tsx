import { useRef, useContext } from "react";
import styles from "../List/List.module.scss";
import useResizeTextarea from "../../hooks/useResizeTextarea";
import { ListsDispatchContext } from "../../providers/ListProvider";
import { List } from "../../types";
import { setDBList } from "../../utils/indexeddb";
import { createId } from "../../utils/general";

type ListTitleProps = {
  list: List;
  setNewListItemId: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function ListTitle({ list, setNewListItemId }: ListTitleProps) {
  const listsDispatch = useContext(ListsDispatchContext);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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
        //Create new list if Enter is pressed without the shift key
        (e) => {
          console.log('onKeyDown firing');
          
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const newItemId = createId();
            const newTimestamp = Date.now();

            listsDispatch({
              type: "item-added",
              listId: list.id,
              itemId: newItemId,
              timestamp: newTimestamp
            });
            });

            setNewListItemId(newItemId);
          }
        }
      }
      onChange={(e) => {
        listsDispatch({
          type: "title-changed",
          listId: list.id,
          newTitle: e.target.value,
        });

        setDBList({
          id: list.id,
          listName: e.target.value,
          timestamp: list.timestamp
        });
      }}
    />
  );
}
