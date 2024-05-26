import { useReducer } from "react";
import { AllTodoLists } from "../types";
import { reorderLists, reorderListItems } from "../utils/indexeddb";
import { TodosAction } from "../types";
import ListsContext from "./ListsContext";

type ListsProviderProps = { children: React.ReactNode }

export default function ListsProvider({ children }: ListsProviderProps) {
  const [todosList, dispatch] = useReducer(todosListReducer, []);

  return (
    <ListsContext.Provider value={[todosList, dispatch]}>
      {children}
    </ListsContext.Provider>
  );
}

function todosListReducer(todoLists: AllTodoLists, action: TodosAction): AllTodoLists {
  switch (action.type) {
    case 'lists-loaded' : {
      console.log('lists-loaded action running');
      return action.lists;
    }
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
          id: action.listId,
          listItems: [],
          timestamp: action.timestamp
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
          let newListItems = [];

          if (action.index !== undefined) {
            newListItems = [
              ...list.listItems.slice(0,action.index + 1),
              {
                itemName: "",
                id: action.itemId,
                listId: action.listId,
                timestamp: action.timestamp,
                completed: false,
              },
              ...list.listItems.slice(action.index + 1)
            ];
          } else {
            newListItems = [
              ...list.listItems,
              {
                itemName: "",
                id: action.itemId,
                listId: action.listId,
                timestamp: action.timestamp,
                completed: false,
              },
            ];
          }

          const newList = {
            ...list,
            listItems: newListItems,
          };

          return newList;
        }
      });

      //Trigger reorder of IndexedDB data if list item was inserted in the middle of the list
      if (action.index !== undefined) {
        reorderListItems(newLists, action.listId);
      }

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
    case "lists-reordered": {
      const newLists = [...todoLists];
      
      newLists.sort((a, b) => {
        const compareValue = action.orderby === "name" ? "listName" : "timestamp";

        if (a[compareValue] > b[compareValue]) {
          return (action.direction === "asc" ? 1 : -1);
        }
        if (a[compareValue] < b[compareValue]) {
          return (action.direction === "asc" ? -1 : 1);
        }
        return 0;
      });

      //Trigger reorder of IndexedDB data
      reorderLists(newLists);

      return newLists;
    }
    case "listitems-reordered": {
      const newLists = todoLists.map((list) => {
        if (list.id === action.listId) {
          const newListItems = [...list.listItems];

          newListItems.sort((a, b) => {
            const compareValue = action.orderby === "name" ? "itemName" : "timestamp";
    
            if (a[compareValue] > b[compareValue]) {
              return (action.direction === "asc" ? 1 : -1);
            }
            if (a[compareValue] < b[compareValue]) {
              return (action.direction === "asc" ? -1 : 1);
            }
            return 0;
          });

          const newList = {
            ...list,
            listItems: newListItems
          }

          return newList;
        } else {
          return list;
        }
      });

      //Trigger reorder of IndexedDB data
      reorderListItems(newLists, action.listId);

      return newLists;
    }
  }
}