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

export type HandleListTitleChangeType = (listId: number, newTitle: string) => void;

export type HandleListItemChangeType = (listId: number, newItemName: string, itemId: number) => void;

export type HandleRemoveList = (listId: number) => void;

export type HandleRemoveItem = (listId: number, itemId: number) => void;

export type HandleAddList = (listItemId: number) => void;

export type HandleAddItem = (listId: number, listItemId: number) => void;

export type HandleMarkItem = (listId: number, itemId: number, complete: boolean) => void;
