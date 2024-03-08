export type ViewState = "allLists" | "singleList";

export type TodosList = {
  listName: string;
  id: number;
  listItems: {
    itemName: string;
    id: number;
    completed: boolean;
  }[];
}[];

export type TodoList = {
  listName: string;
  id: number;
  listItems: {
    itemName: string;
    id: number;
    completed: boolean;
  }[];
};
