export type ViewState = "allLists" | "singleList";

export type AllTodoLists = List[];

export type List = {
  listName: string;
  id: number;
  timestamp: number;
  listItems: ListItem[];
}

export type ListItem = {
  itemName: string;
  id: number;
  listId: number;
  timestamp: number;
  completed: boolean;
}

export type TodosAction =
  | { type: "lists-loaded"; lists: AllTodoLists; }
  | { type: "title-changed"; listId: number; newTitle: string; }
  | { type: "item-changed"; listId: number; newItemName: string; itemId: number; }
  | { type: "list-removed"; listId: number; }
  | { type: "item-removed"; listId: number; itemId: number; }
  | { type: "list-added"; listId: number; timestamp: number; }
  | { type: "item-added"; listId: number; itemId: number; timestamp: number; index?: number }
  | { type: "item-marked"; listId: number; itemId: number; completed: boolean }
  | { type: "lists-reordered", orderby: "name" | "date", direction: "asc" | "desc" }
  | { type: "listitems-reordered", orderby: "name" | "date", direction: "asc" | "desc", listId: number };

  export type DBErrorProps = {
    error: boolean;
    message: string;
  };