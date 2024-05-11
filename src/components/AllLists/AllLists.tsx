import { useContext } from "react";
import { ListsContext, ListsDispatchContext } from "../../providers/ListProvider";
import { ViewState } from "../../types";
import TrashIcon from "../../assets/TrashIcon";
import styles from "./AllLists.module.scss";
//@ts-expect-error Don't have types for IndexedDB yet
import { setList } from '../../utils/indexeddb';
import { createId } from "../../utils/general";


type AllListsProps = {
  onSetView: React.Dispatch<React.SetStateAction<ViewState>>;
  onSetCurrentListId: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function AllLists({ onSetView, onSetCurrentListId }: AllListsProps) {
  const todosLists = useContext(ListsContext);
  const listsDispatch = useContext(ListsDispatchContext);

  const todosElements = todosLists.map((todosList) => {
    return (
      <div className={styles.listRow} key={todosList.id.toString()}>
        <button
          className={styles.listBtn}
          onClick={() => {
            onSetView("singleList");
            onSetCurrentListId(todosList.id);
          }}
        >
          {todosList.listName ? todosList.listName : <em>Untitled</em>}
        </button>
        <button onClick={() => 
          listsDispatch({
            type: "list-removed",
            listId: todosList.id,
          })} 
          className={styles.trashBtn}>
          <TrashIcon className={styles.trashIcon} />
        </button>
      </div>
    );
  });

  return (
    <>
      <h1>All Lists</h1>
      {todosElements}
      <button
        className="button"
        onClick={() => {
          const newListId = createId();

          listsDispatch({
            type: "list-added",
            listId: newListId
          });

          setList({ id: newListId, listName: '', timestamp: Date.now() });

          onSetCurrentListId(newListId);
          onSetView('singleList');
        }}
      >
        + Create List
      </button>
    </>
  );
}
