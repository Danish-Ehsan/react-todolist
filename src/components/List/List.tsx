import { ViewState, TodoList, TodosList } from "../../types";

type listProps = {
  onSetView: React.Dispatch<React.SetStateAction<ViewState>>;
  list: TodoList | undefined;
  onListChange: React.Dispatch<React.SetStateAction<TodosList>>;
};

export default function List({ list, onSetView, onListChange }: listProps) {
  const handleListTitleChange = (newTitle: string) => {
    onListChange((allLists) => {
      const newLists = allLists.map((currentList) => {
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

  const handleListItemChange = (newItemName: string, itemId: number) => {
    onListChange((allLists) => {
      const newLists = allLists.map((currentList) => {
        if (list !== undefined && currentList.id === list.id) {
          const newListItems = currentList.listItems.map((listItem) => {
            if (listItem.id === itemId) {
              return {
                ...listItem,
                itemName: newItemName,
              };
            } else {
              return listItem;
            }
          });
          return {
            ...currentList,
            listItems: newListItems,
          };
        } else {
          return currentList;
        }
      });

      return newLists;
    });
  };

  const listItemElems = list?.listItems.map((listItem) => {
    return <input type="text" value={listItem.itemName} key={listItem.id.toString()} onChange={(e) => handleListItemChange(e.target.value, listItem.id)} />;
  });

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
      {listItemElems}
      <div>
        <button onClick={() => onSetView("allLists")}>Show All Lists</button>
      </div>
    </>
  );
}
