import cx from "classnames";
import { Plus } from "phosphor-react";
import { useDrop } from "react-dnd";
import { v4 as uuidv4 } from "uuid";
import { useCase } from "../../contexts";
import { IDragItemType, UserRole } from "../../types";

interface DroppableColumnProps {
  position: { sectionId: string; rowId: string };
  columnRole: UserRole;
  children: React.ReactNode;
}

export const DroppableColumn: React.FC<DroppableColumnProps> = ({
  position,
  columnRole,
  children,
}) => {
  const { individualEntrySorting, setIndividualEntrySorting } = useCase();

  /**
   * Moves an item from one list to another list.
   * @param from Position of the entry being dragged
   * @param to New position the entry is being dropped
   * @param indexOfEntry Index of the entry being dragged
   */
  const moveItem = (
    from: { sectionId: string; rowId: string; column: number },
    to: { sectionId: string; rowId: string },
    indexOfEntry: number
  ) => {
    const newSorting = { ...individualEntrySorting };
    // Remove dragged item by the rowId
    const rowIndex = newSorting[from.sectionId].findIndex(
      (row) => row.rowId === from.rowId
    );
    const draggedItem = newSorting[from.sectionId][rowIndex].columns[
      from.column
    ].splice(indexOfEntry, 1)[0];

    // Add dragged item to the new rowId
    const newRowIndex = newSorting[to.sectionId].findIndex(
      (row) => row.rowId === to.rowId
    );
    newSorting[to.sectionId][newRowIndex].columns[from.column].push(
      draggedItem
    );

    // Update State
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

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: IDragItemType.ENTRY,
    drop: (_: any, monitor) => {
      const oldPosition = monitor.getItem().position;
      const indexOfItem = monitor.getItem().index;
      moveItem(oldPosition, position, indexOfItem);
    },
    canDrop: (_: any, monitor) => {
      const role = monitor.getItem().role;
      return role === columnRole;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={cx(
        "relative column p-4 rounded-lg border-2 border-dotted border-gray-400  text-black",
        {
          "bg-blue-600/25": isOver && canDrop,
        }
      )}>
      {children}
      <button
        onClick={() => addRowAfter(position.sectionId, position.rowId)}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-darkGrey hover:bg-mediumGrey text-white p-1 rounded-full">
        <Plus width={18} height={18} weight="bold" />
      </button>
    </div>
  );
};
