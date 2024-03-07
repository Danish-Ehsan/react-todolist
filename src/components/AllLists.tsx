import { ListViewState } from "../types";

type AllListsProps = {
  handleSetListView: React.Dispatch<React.SetStateAction<ListViewState>>;
  handleListChange: React.Dispatch<React.SetStateAction<number>>;
};

export default function AllLists({ handleSetListView }: AllListsProps) {
  return (
    <>
      <div>This is the all lists view</div>
      <button
        onClick={() => {
          handleSetListView("singleList");
        }}
      >
        Show Single List
      </button>
    </>
  );
}
