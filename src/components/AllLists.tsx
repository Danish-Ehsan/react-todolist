import { ListViewState } from "../types";

type AllListsProps = {
  onSetView: React.Dispatch<React.SetStateAction<ListViewState>>;
  onListChange: React.Dispatch<React.SetStateAction<number>>;
};

export default function AllLists({ onSetView }: AllListsProps) {
  return (
    <>
      <div>This is the all lists view</div>
      <button
        onClick={() => {
          onSetView("singleList");
        }}
      >
        Show Single List
      </button>
    </>
  );
}
