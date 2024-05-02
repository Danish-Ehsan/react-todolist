import { useRef } from "react";
import { HandleListTitleChangeType } from "../../types";
import styles from "../List/List.module.scss";
import useResizeTextarea from "../../hooks/useResizeTextarea";

type ListTitleProps = {
  listTitle: string;
  listId: number;
  onListTitleChange: HandleListTitleChangeType;
};

export default function ListTitle({ listTitle, listId, onListTitleChange }: ListTitleProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useResizeTextarea(textareaRef, listTitle);

  return (
    <textarea
      className={`${styles.listTitle} ${styles.listTextarea}`}
      value={listTitle}
      rows={1}
      ref={textareaRef}
      onChange={(e) => {
        onListTitleChange(listId, e.target.value);
      }}
    />
  );
}
