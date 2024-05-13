import { useRef, useContext } from "react";
import styles from "../List/List.module.scss";
import useResizeTextarea from "../../hooks/useResizeTextarea";
import { ListsDispatchContext } from "../../providers/ListProvider";
import { AllTodoLists } from "../../types";
import { setDBList } from "../../utils/indexeddb";

type ListTitleProps = {
  list: AllTodoLists[0]
};

export default function ListTitle({ list }: ListTitleProps) {
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
