import { ViewState, TodosList } from "../types";

type AllListsProps = {
  onSetView: React.Dispatch<React.SetStateAction<ViewState>>;
  onListChange: React.Dispatch<React.SetStateAction<number>>;
  todosList: TodosList;
};

export default function AllLists({ onSetView, onListChange, todosList }: AllListsProps) {
  const todosElements = todosList.map((todoList) => {
    return (
      <button
        onClick={() => {
          onSetView("singleList");
          onListChange(todoList.id);
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
