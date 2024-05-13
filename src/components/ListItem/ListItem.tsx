import { useRef, useContext } from "react";
import { AllTodoLists } from "../../types";
import allListStyles from "../AllLists/AllLists.module.scss";
import listStyles from "../List/List.module.scss";
import TrashIcon from "../../assets/TrashIcon";
import useResizeTextarea from "../../hooks/useResizeTextarea";
import { ListsDispatchContext } from "../../providers/ListProvider";
import { setDBListItem, deleteDBListItem } from "../../utils/indexeddb";

type ListItemProps = {
  shouldAutoFocus: boolean;
  listItem: AllTodoLists[0]["listItems"][0];
  listId: number;
};

export default function ListItem({ listItem, listId, shouldAutoFocus }: ListItemProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const listsDispatch = useContext(ListsDispatchContext);

  useResizeTextarea(textareaRef, listItem.itemName);

  return (
    <div className={`${allListStyles.listRow} ${allListStyles["listRow--align-start"]}`} key={listItem.id.toString()}>
      <label className={listStyles.checkboxLabel}>
        <input 
          className={listStyles.checkbox} 
          type="checkbox" 
          checked={listItem.completed} 
          onChange={
            () => {
              listsDispatch({
                type: "item-marked",
                listId: listId,
                itemId: listItem.id,
                completed: !listItem.completed,
              });

              setDBListItem({
                id: listItem.id,
                listId: listId,
                itemName: listItem.itemName,
                completed: !listItem.completed
              });
            }
          } 
        />
        <span className={listStyles.customCheckmark}></span>
      </label>
      <textarea 
        ref={textareaRef} 
        value={listItem.itemName} 
        className={`${listStyles.listTextarea} ${listStyles.listItem} ${listItem.completed ? listStyles["is-completed"] : ""}`} 
        rows={1} 
        autoFocus={shouldAutoFocus}
        onChange={
          (e) => {
            listsDispatch({
              type: "item-changed",
              listId: listId,
              newItemName: e.target.value,
              itemId: listItem.id,
            });

            setDBListItem({
              id: listItem.id,
              listId: listId,
              itemName: e.target.value,
              completed: listItem.completed
            });
          }
        } 
      />
      <button 
        onClick={() => {
          listsDispatch({
            type: "item-removed",
            listId: listId,
            itemId: listItem.id,
          });

          deleteDBListItem(listItem.id);
        }} 
        className={`${allListStyles.trashBtn} ${allListStyles["trashBtn--listItem"]}`}
      >
        <TrashIcon className={allListStyles.trashIcon} />
      </button>
    </div>
  );
}
