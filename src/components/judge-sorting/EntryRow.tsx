import { useCase } from "../../contexts";

interface EntryRowProps {
  sectionId: string;
  rowId: string;
  hasChildren: boolean;
  children: React.ReactNode;
}

export const EntryRow: React.FC<EntryRowProps> = ({
  sectionId,
  rowId,
  hasChildren,
  children,
}) => {
  const { individualEntrySorting, setIndividualEntrySorting } = useCase();

  const deleteRow = (
    e: React.MouseEvent<HTMLDivElement>,
    sectionId: string,
    rowId: string
  ) => {
    e.preventDefault();

    if (hasChildren) {
      return;
    }

    const newSorting = { ...individualEntrySorting };
    const rowIndex = newSorting[sectionId].findIndex(
      (row) => row.rowId === rowId
    );
    newSorting[sectionId].splice(rowIndex, 1);
    setIndividualEntrySorting(newSorting);
  };

  return (
    <>
      <div
        onContextMenu={(e) => deleteRow(e, sectionId, rowId)}
        className="rounded-lg select-none grid grid-cols-2 gap-6">
        {children}
      </div>
    </>
  );
};
