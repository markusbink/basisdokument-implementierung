import cx from "classnames";
import { useRef, useState } from "react";
import { useCase } from "../../contexts";
import { useOutsideClick } from "../../hooks/use-outside-click";

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
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const contextMenuRef = useRef<HTMLUListElement>(null);
  useOutsideClick(contextMenuRef, () => setIsContextMenuOpen(false));

  const deleteEmptyRow = (sectionId: string, rowId: string) => {
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

  const deleteAllEmptyRows = (sectionId: string) => {
    const newSorting = { ...individualEntrySorting };

    // Remove all rows that have no entries in the columns
    newSorting[sectionId] = newSorting[sectionId].filter((row) =>
      row.columns.some((column) => column.length > 0)
    );

    setIndividualEntrySorting(newSorting);
  };

  return (
    <>
      <div
        onContextMenu={(e) => {
          e.preventDefault();
          setContextMenuPosition({ x: e.clientX, y: e.clientY });
          console.log({ x: e.clientX, y: e.clientY });

          setIsContextMenuOpen(true);
        }}
        className="relative rounded-lg select-none grid grid-cols-2 gap-6">
        {children}
        {isContextMenuOpen && !hasChildren && (
          <ul
            ref={contextMenuRef}
            style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
            className={cx(
              "fixed list-none bg-darkGrey rounded-lg text-sm z-20 m-0"
            )}>
            <li
              className="text-white px-3 py-2 cursor-pointer hover:bg-white/10 transition-all"
              onClick={() => deleteEmptyRow(sectionId, rowId)}>
              Delete empty row
            </li>
            <li
              className="text-white px-3 py-2 cursor-pointer hover:bg-white/10 transition-all"
              onClick={() => deleteAllEmptyRows(sectionId)}>
              Delete all empty rows
            </li>
          </ul>
        )}
      </div>
    </>
  );
};
