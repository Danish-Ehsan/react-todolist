import { ViewState, TodosList } from "../../types";

type AllListsProps = {
  onSetView: React.Dispatch<React.SetStateAction<ViewState>>;
  onListSet: React.Dispatch<React.SetStateAction<number | null>>;
  todosList: TodosList;
};

export default function AllLists({ onSetView, onListSet, todosList }: AllListsProps) {
  const todosElements = todosList.map((todoList) => {
    return (
      <button
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
      <div>This is the all lists view</div>
      {todosElements}
    </>
  );
}
