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