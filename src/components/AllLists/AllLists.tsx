import { ViewState, AllTodoLists, HandleRemoveList, HandleAddList } from "../../types";
import TrashIcon from "../../assets/TrashIcon";
import styles from "./AllLists.module.scss";

type AllListsProps = {
  onSetView: React.Dispatch<React.SetStateAction<ViewState>>;
  onListSet: React.Dispatch<React.SetStateAction<number | null>>;
  todosList: AllTodoLists;
  onRemoveList: HandleRemoveList;
  onAddList: HandleAddList;
};

export default function AllLists({ onSetView, onListSet, todosList, onRemoveList, onAddList }: AllListsProps) {
  const todosElements = todosList.map((todoList) => {
    return (
      <div className={styles.listRow} key={todoList.id.toString()}>
        <button
          className={styles.listBtn}
          onClick={() => {
            onSetView("singleList");
            onListSet(todoList.id);
          }}
        >
          {todoList.listName ? todoList.listName : <em>Untitled</em>}
        </button>
        <button onClick={() => onRemoveList(todoList.id)} className={styles.trashBtn}>
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
          onAddList(Date.now());
        }}
      >
        + Create List
      </button>
    </>
  );
}
