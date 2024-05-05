import { createContext, useReducer } from "react";
import { todoLists as initialTodos } from "../data";
import { AllTodoLists } from "../types";

type ListsProviderProps = { children: React.ReactNode }

type TodosAction =
  | { type: "title-changed"; listId: number; newTitle: string }
  | { type: "item-changed"; listId: number; newItemName: string; itemId: number }
  | { type: "list-removed"; listId: number }
  | { type: "item-removed"; listId: number; itemId: number }
  | { type: "list-added"; listItemId: number }
  | { type: "item-added"; listId: number; listItemId: number }
  | { type: "item-marked"; listId: number; itemId: number; completed: boolean };

export const ListsContext = createContext<AllTodoLists>(initialTodos);
export const ListsDispatchContext = createContext<React.Dispatch<TodosAction>>(null!);

export function ListsProvider({ children }: ListsProviderProps) {
  const [todosList, dispatch] = useReducer(todosListReducer, initialTodos);

  return (
    <ListsContext.Provider value={todosList}>
      <ListsDispatchContext.Provider value={dispatch}>
        {children}
      </ListsDispatchContext.Provider>
    </ListsContext.Provider>
  );
}

function todosListReducer(todoLists: AllTodoLists, action: TodosAction) {
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
      const newLists = [
        ...todoLists,
        {
          listName: "",
          id: action.listItemId,
          listItems: [],
        },
      ];

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
              id: action.listItemId,
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
    case "item-marked": {
      const newLists = todoLists.map((list) => {
        if (list.id !== action.listId) {
          return list;
        } else {
          const newListItems = list.listItems.map((listItem) => {
            if (listItem.id !== action.itemId) {
              return listItem;
            } else {
              return {
                ...listItem,
                completed: action.completed,
              };
            }
          });

          return {
            ...list,
            listItems: newListItems,
          };
        }
      });

      return newLists;
    }
  }
}