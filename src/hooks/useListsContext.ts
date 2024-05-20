import { useContext } from "react";
import { ListsContext } from "../providers/ListProvider";

export default function useListsContext() {
  const listsContext = useContext(ListsContext);

  if (!listsContext) {
    throw new Error("useUserContext was used outside of its Provider");
  }

  console.log(listsContext);

  return listsContext;
}