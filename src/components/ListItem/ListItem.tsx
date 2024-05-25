import { useRef, useEffect } from "react";
import { ListItem as ListItemType } from "../../types";
import allListStyles from "../AllLists/AllLists.module.scss";
import listStyles from "../List/List.module.scss";
//import TrashIcon from "../../assets/TrashIcon";
import { TiDelete } from "react-icons/ti";
import useResizeTextarea from "../../hooks/useResizeTextarea";
import useListsContext from "../../hooks/useListsContext";
import { createDBListItem, updateDBListItem, deleteDBListItem } from "../../utils/indexeddb";
import { createId } from "../../utils/general";
import useDBSyncState from "../../hooks/useDBSyncState";

type ListItemProps = {
  listItem: ListItemType;
  listId: number;
  index: number;
  listIndex: number;
  setNewListItemId: React.Dispatch<React.SetStateAction<number | null>>;
  shouldAutoFocus: boolean;
};

export default function ListItem({ listItem, listId, index, listIndex, setNewListItemId, shouldAutoFocus }: ListItemProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const debounceTimeoutID = useRef<number | null>(null);
  const [lists, listsDispatch] = useListsContext();
  const [, setDBSyncState] = useDBSyncState();

  //Resize text area height to fit text
  useResizeTextarea(textareaRef, listItem.itemName);

  //Focus list item when shouldAutoFocus is first changed to true
  useEffect(() => {
    if (shouldAutoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [shouldAutoFocus]);

  console.log({shouldAutoFocus});

  return (
    <div className={`${allListStyles.listRow} ${allListStyles["listRow--align-start"]}`} key={listItem.id.toString()}>
      <label className={listStyles.checkboxLabel}>
        <input 
          className={listStyles.checkbox} 
          type="checkbox" 
          checked={listItem.completed} 
          onChange={
            () => {
              setDBSyncState(false);

              listsDispatch({
                type: "item-marked",
                listId: listId,
                itemId: listItem.id,
                completed: !listItem.completed,
              });

              updateDBListItem({
                id: listItem.id,
                completed: !listItem.completed
              })
                .then(() => setDBSyncState(true));
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
        onKeyDown={
          (e) => {
            console.log('onKeyDown firing');
            console.log({index});
            
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const newItemId = createId();
              const newTimestamp = Date.now();
              setDBSyncState(false);

              listsDispatch({
                type: "item-added",
                listId: listId,
                itemId: newItemId,
                timestamp: newTimestamp,
                index: index
              });

              createDBListItem({
                id: newItemId,
                listId: listId,
                itemName: '',
                completed: false,
                timestamp: newTimestamp,
                order: null
              })
                .then(() => setDBSyncState(true));

              setNewListItemId(newItemId);
            }
          }
        }
        onChange={
          (e) => {
            console.log('onChange firing');
            setDBSyncState(false);

            listsDispatch({
              type: "item-changed",
              listId: listId,
              newItemName: e.target.value,
              itemId: listItem.id,
            });

            //Debounce database sync on user input
            if (debounceTimeoutID.current) {
              clearInterval(debounceTimeoutID.current);
            }

            debounceTimeoutID.current = setTimeout(() => {
              console.log('listItem onChange debounce func firing');
              updateDBListItem({
                id: listItem.id,
                itemName: e.target.value,
              })
                .then(() => setDBSyncState(true));
            }, 500);
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
        {/* <TrashIcon className={allListStyles.trashIcon} /> */}
        <TiDelete className={allListStyles.trashIcon}/>
      </button>
    </div>
  );
}
