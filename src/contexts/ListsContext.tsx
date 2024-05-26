import { createContext } from "react";
import { AllTodoLists } from "../types";
import { TodosAction } from "../types";

const ListsContext = createContext<[AllTodoLists, React.Dispatch<TodosAction>] | null>(null);

export default ListsContext;