import { ViewState, AllTodoLists, HandleRemoveList } from "../../types";
import TrashIcon from "../../assets/TrashIcon";
import styles from "./AllLists.module.scss";

type AllListsProps = {
  onSetView: React.Dispatch<React.SetStateAction<ViewState>>;
  onListSet: React.Dispatch<React.SetStateAction<number | null>>;
  todosList: AllTodoLists;
  onRemoveList: HandleRemoveList;
};

export default function AllLists({ onSetView, onListSet, todosList, onRemoveList }: AllListsProps) {
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
          {todoList.listName}
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
    </>
  );
}