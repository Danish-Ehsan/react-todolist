export type ViewState = "allLists" | "singleList";

export type AllTodoLists = {
  listName: string;
  id: number;
  listItems: {
    itemName: string;
    id: number;
    completed: boolean;
  }[];
}[];

export type SingleTodoList = {
  listName: string;
  id: number;
  listItems: {
    itemName: string;
    id: number;
    completed: boolean;
  }[];
};
