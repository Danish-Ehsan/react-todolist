import useListsContext from "../../hooks/useListsContext";
import { ViewState } from "../../types";
import TrashIcon from "../../assets/TrashIcon";
import styles from "./AllLists.module.scss";
import { createDBList, deleteDBList } from '../../utils/indexeddb';
import { createId } from "../../utils/general";
import useDBSyncState from "../../hooks/useDBSyncState";


type AllListsProps = {
  onSetView: React.Dispatch<React.SetStateAction<ViewState>>;
  onSetCurrentListId: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function AllLists({ onSetView, onSetCurrentListId }: AllListsProps) {
  const [todosLists, listsDispatch] = useListsContext();
  const [, setDBSyncState] = useDBSyncState();

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
        <button onClick={() => {
          setDBSyncState(false);

          listsDispatch({
            type: "list-removed",
            listId: todosList.id,
          });

          deleteDBList(todosList.id)
            .then(() => setDBSyncState(true));
        }} 
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
          const newTimestamp = Date.now();
          setDBSyncState(false);

          listsDispatch({
            type: "list-added",
            listId: newListId,
            timestamp: newTimestamp
          });

          createDBList({ id: newListId, listName: '', timestamp: newTimestamp })
            .then(() => { setDBSyncState(true) });

          onSetCurrentListId(newListId);
          onSetView('singleList');
        }}
      >
        + Create List
      </button>
    </>
  );
}
