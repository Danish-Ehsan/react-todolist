import { useContext } from "react";
import { ListsContext } from "../providers/ListsProvider";

export default function useListsContext() {
  const listsContext = useContext(ListsContext);

  if (!listsContext) {
    throw new Error("useUserContext was used outside of its Provider");
  }

  return listsContext;
}