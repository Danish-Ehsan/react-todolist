import { AllTodoLists } from "./types";

type TodosAction =
  | { type: "title-changed"; listId: number; newTitle: string }
  | { type: "item-changed"; listId: number; newItemName: string; itemId: number }
  | { type: "list-removed"; listId: number }
  | { type: "item-removed"; listId: number; itemId: number }
  | { type: "list-added"; setCurrentListId: React.Dispatch<React.SetStateAction<number | null>> }
  | { type: "item-added"; listId: number };

export function todosListReducer(todoLists: AllTodoLists, action: TodosAction) {
  switch (action.type) {
    case "title-changed": {
      const newLists = todoLists.map((currentList) => {
        if (action.listId !== undefined && currentList.id === action.listId) {
          return {
            ...currentList,
            listName: action.newTitle,
          };
        } else {
          return currentList;
        }
      });

      return newLists;
    }
    case "item-changed": {
      const newLists = todoLists.map((currentList) => {
        if (action.listId !== undefined && currentList.id === action.listId) {
          const newListItems = currentList.listItems.map((listItem) => {
            if (listItem.id === action.itemId) {
              return {
                ...listItem,
                itemName: action.newItemName,
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
    }
    case "list-removed": {
      const newLists = todoLists.filter((list) => list.id !== action.listId);
      return newLists;
    }
    case "item-removed": {
      console.log("item removed reducer firing");
      const newLists = todoLists.map((list) => {
        if (list.id !== action.listId) {
          return list;
        } else {
          const newListItems = list.listItems.filter((listItem) => listItem.id !== action.itemId);
          const newList = {
            ...list,
            listItems: newListItems,
          };

          return newList;
        }
      });

      return newLists;
    }
    case "list-added": {
      const newId = Date.now();
      const newLists = [
        ...todoLists,
        {
          listName: "Untitled",
          id: newId,
          listItems: [],
        },
      ];

      action.setCurrentListId(newId);
      console.log(todoLists);

      return newLists;
    }
    case "item-added": {
      console.log("item added reducer firing");
      const newLists = todoLists.map((list) => {
        if (list.id !== action.listId) {
          return list;
        } else {
          const newListItems = [
            ...list.listItems,
            {
              itemName: "",
              id: Date.now(),
              completed: false,
            },
          ];

          const newList = {
            ...list,
            listItems: newListItems,
          };

          return newList;
        }
      });

      return newLists;
    }
  }
}
