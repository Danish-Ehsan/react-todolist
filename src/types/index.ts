export type ViewState = "allLists" | "singleList";

export type AllTodoLists = {
  listName: string;
  id: number;
  timestamp: number;
  listItems: {
    itemName: string;
    id: number;
    listId: number;
    timestamp: number;
    completed: boolean;
  }[];
}[];