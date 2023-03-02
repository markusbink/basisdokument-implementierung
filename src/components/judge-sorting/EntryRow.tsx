import cx from "classnames";
import { Plus, Trash } from "phosphor-react";
import { forwardRef, useRef, useState } from "react";
import { useCase } from "../../contexts";
import { useOutsideClick } from "../../hooks/use-outside-click";
import { v4 as uuidv4 } from "uuid";
import { LitigiousCheck } from "../entry/LitigiousCheck";

interface EntryRowProps {
  sectionId: string;
  rowId: string;
  isLitigious: boolean | undefined;
  hasChildren: boolean;
  children: React.ReactNode;
}

export const EntryRow: React.FC<EntryRowProps> = ({
  sectionId,
  rowId,
  isLitigious,
  hasChildren,
  children,
}) => {
  const { individualEntrySorting, setIndividualEntrySorting } = useCase();
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
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

    // Add a new empty row to each section if it has no rows yet
    Object.keys(newSorting).forEach((sectionId) => {
      if (newSorting[sectionId].length === 0) {
        const newRow = {
          rowId: uuidv4(),
          columns: [[], []],
        };

        newSorting[sectionId].push(newRow);
      }
    });

    setIndividualEntrySorting(newSorting);
  };

  const deleteAllEmptyRows = () => {
    const newSorting = { ...individualEntrySorting };

    // Remove all empty rows
    Object.keys(newSorting).forEach((sectionId) => {
      newSorting[sectionId] = newSorting[sectionId].filter((row) =>
        row.columns.some((column) => column.length > 0)
      );
    });

    // Add a new empty row to each section if it has no rows yet
    Object.keys(newSorting).forEach((sectionId) => {
      if (newSorting[sectionId].length === 0) {
        const newRow = {
          rowId: uuidv4(),
          columns: [[], []],
        };

        newSorting[sectionId].push(newRow);
      }
    });

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
        className={cx(
          "relative rounded-lg select-none grid grid-cols-2 gap-6 border-dashed p-6 pt-10 border ",
          {
            "border border-mediumGrey/50":
              !isContextMenuOpen || (isContextMenuOpen && hasChildren),
            "!border-2 border-blue-600": isContextMenuOpen && !hasChildren,
          }
        )}>
        {!hasChildren && (
          <div className="absolute top-0 right-0 w-fit">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsContextMenuOpen(true);
              }}
              className=" translate-x-1/2 -translate-y-1/2 bg-darkGrey hover:bg-mediumGrey text-white p-1 rounded-full">
              <Trash width={16} height={16} />
            </button>
            {isContextMenuOpen && (
              <ContextMenu
                ref={contextMenuRef}
                deleteEmptyRow={() => deleteEmptyRow(sectionId, rowId)}
                deleteAllEmptyRows={() => deleteAllEmptyRows()}
              />
            )}
          </div>
        )}

        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <LitigiousCheck rowId={rowId} isLitigious={isLitigious} />
        </span>
        {children}
        <button
          onClick={() => addRowAfter(sectionId, rowId)}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-darkGrey hover:bg-mediumGrey text-white p-1 rounded-full">
          <Plus width={18} height={18} weight="bold" />
        </button>
      </div>
    </>
  );
};

interface ContextMenuProps {
  deleteEmptyRow: () => void;
  deleteAllEmptyRows: () => void;
}

const ContextMenu = forwardRef<HTMLUListElement, ContextMenuProps>(
  ({ deleteEmptyRow, deleteAllEmptyRows }, ref) => {
    return (
      <ul
        ref={ref}
        className={cx(
          "absolute list-none bg-darkGrey rounded-lg text-sm z-50 m-0 w-fit -translate-x-[80%] -translate-y-2"
        )}>
        <li
          className="flex items-center gap-2 !m-0 text-white p-3 cursor-pointer hover:bg-white/10 transition-all whitespace-nowrap"
          onClick={deleteEmptyRow}>
          Leere Zeile löschen
        </li>
        <li
          className="flex items-center gap-2 !m-0 text-white p-3 cursor-pointer hover:bg-white/10 transition-all whitespace-nowrap"
          onClick={deleteAllEmptyRows}>
          Alle leeren Zeilen löschen
        </li>
      </ul>
    );
  }
);
