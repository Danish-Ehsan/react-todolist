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

export type HandleListTitleChangeType = (listId: number, newTitle: string) => void;

export type HandleListItemChangeType = (listId: number, newItemName: string, itemId: number) => void;

export type HandleRemoveList = (listId: number) => void;
