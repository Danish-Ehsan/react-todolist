import { ViewState, TodosList } from "../../types";
import styles from "./AllLists.module.scss";

type AllListsProps = {
  onSetView: React.Dispatch<React.SetStateAction<ViewState>>;
  onListSet: React.Dispatch<React.SetStateAction<number | null>>;
  todosList: TodosList;
};

export default function AllLists({ onSetView, onListSet, todosList }: AllListsProps) {
  const todosElements = todosList.map((todoList) => {
    return (
      <button
        className={styles.listBtn}
        key={todoList.id.toString()}
        onClick={() => {
          onSetView("singleList");
          onListSet(todoList.id);
        }}
      >
        {todoList.listName}
      </button>
    );
  });

  return (
    <>
      <h1>All Lists</h1>
      {todosElements}
    </>
  );
}
