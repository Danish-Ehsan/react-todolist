import { ViewState } from "../types";

type listProps = {
  listId: number;
  onSetView: React.Dispatch<React.SetStateAction<ViewState>>;
};

export default function List({ listId, onSetView }: listProps) {
  return (
    <>
      <div>This is a single List</div>
      <button
        onClick={() => {
          onSetView("allLists");
        }}
      >
        Back to All Lists
      </button>
    </>
  );
}
