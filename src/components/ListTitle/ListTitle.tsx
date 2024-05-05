import { useRef, useContext } from "react";
import styles from "../List/List.module.scss";
import useResizeTextarea from "../../hooks/useResizeTextarea";
import { ListsDispatchContext } from "../../providers/ListProvider";

type ListTitleProps = {
  listTitle: string;
  listId: number;
};

export default function ListTitle({ listTitle, listId }: ListTitleProps) {
  const listsDispatch = useContext(ListsDispatchContext);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useResizeTextarea(textareaRef, listTitle);

  return (
    <textarea
      className={`${styles.listTitle} ${styles.listTextarea}`}
      value={listTitle}
      rows={1}
      ref={textareaRef}
      placeholder="List Title"
      autoFocus={listTitle === ''}
      onChange={(e) => {
        listsDispatch({
          type: "title-changed",
          listId: listId,
          newTitle: e.target.value,
        });
      }}
    />
  );
}
