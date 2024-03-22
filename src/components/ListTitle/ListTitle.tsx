import { HandleListTitleChangeType } from "../../types";
import styles from "../List/List.module.scss";

type ListTitleProps = {
  listTitle: string;
  listId: number;
  onListTitleChange: HandleListTitleChangeType;
};

export default function ListTitle({ listTitle, listId, onListTitleChange }: ListTitleProps) {
  return (
    <textarea
      className={`${styles.listTitle} ${styles.listTextarea}`}
      rows={1}
      onChange={(e) => {
        onListTitleChange(listId, e.target.value);
      }}
    >
      {listTitle}
    </textarea>
  );
}
