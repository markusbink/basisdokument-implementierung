import cx from "classnames";
import { Plus, Trash } from "phosphor-react";
import { useRef, useState } from "react";
import { useCase } from "../../contexts";
import { useOutsideClick } from "../../hooks/use-outside-click";
import { v4 as uuidv4 } from "uuid";

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

  const addRowAfter = (sectionId: string, rowId: string) => {
    const newSorting = { ...individualEntrySorting };
    const rowIndex = newSorting[sectionId].findIndex(
      (row) => row.rowId === rowId
    );
    const newRow = {
      rowId: uuidv4(),
      columns: [[], []],
    };

    newSorting[sectionId].splice(rowIndex + 1, 0, newRow);
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
        className="relative rounded-lg select-none grid grid-cols-2 gap-6 border border-dashed border-mediumGrey/50 p-6">
        {children}
        <button
          onClick={() => addRowAfter(sectionId, rowId)}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-darkGrey hover:bg-mediumGrey text-white p-1 rounded-full">
          <Plus width={18} height={18} weight="bold" />
        </button>
        {isContextMenuOpen && !hasChildren && (
          <ul
            ref={contextMenuRef}
            style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
            className={cx(
              "fixed list-none bg-darkGrey rounded-lg text-sm z-20 m-0"
            )}>
            <li
              className="flex items-center gap-2 !m-0 text-white p-3 cursor-pointer hover:bg-white/10 transition-all"
              onClick={() => deleteEmptyRow(sectionId, rowId)}>
              <Trash width={18} height={18} /> Leere Zeile löschen
            </li>
            <li
              className="flex items-center gap-2 !m-0 text-white p-3 cursor-pointer hover:bg-white/10 transition-all"
              onClick={() => deleteAllEmptyRows(sectionId)}>
              <Trash width={18} height={18} />
              Alle leeren Zeilen löschen
            </li>
          </ul>
        )}
      </div>
    </>
  );
};