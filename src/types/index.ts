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
