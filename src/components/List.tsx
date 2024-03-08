import { ViewState, TodoList, TodosList } from "../types";

type listProps = {
  onSetView: React.Dispatch<React.SetStateAction<ViewState>>;
  list: TodoList | undefined;
  onListChange: React.Dispatch<React.SetStateAction<TodosList>>;
};

export default function List({ list, onSetView, onListChange }: listProps) {
  const handleListTitleChange = (newTitle: string) => {
    onListChange((AllLists) => {
      const newLists = AllLists.map((currentList) => {
        if (list !== undefined && currentList.id === list.id) {
          return {
            ...currentList,
            listName: newTitle,
          };
        } else {
          return currentList;
        }
      });

      return newLists;
    });
  };

  return (
    <>
      <div>This is a single List</div>
      <input
        type="text"
        value={list?.listName}
        onChange={(e) => {
          handleListTitleChange(e.target.value);
        }}
      />
      <div>
        <button onClick={() => onSetView("allLists")}>Show All Lists</button>
      </div>
    </>
  );
}
