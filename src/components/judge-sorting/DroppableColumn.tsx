import { useDrop } from "react-dnd";
import { useCase } from "../../contexts";
import { IDragItemType, UserRole } from "../../types";
import cx from "classnames";
import { Plus } from "phosphor-react";

export const DroppableColumn = ({
  position,
  columnRole,
  children,
}: {
  position: { x: number; y: string };
  columnRole: UserRole;
  children: React.ReactNode;
}) => {
  const { individualEntrySorting, setIndividualEntrySorting } = useCase();

  /**
   * Moves an item from one list to another list.
   * @param from The coordinates of the item to move.
   * @param to The coordinates of the item to move to.
   */
  const moveItem = (
    from: { x: number; y: string; indexOfEntry: number },
    to: { x: number; y: string },
    indexOfEntry: number
  ) => {
    const newSorting = [...individualEntrySorting];
    // Remove dragged item by the rowId
    const draggedItem = newSorting.find((item) => item.rowId === from.y)
      ?.columns[from.x][indexOfEntry];

    const draggedItemIndex = newSorting.findIndex(
      (item) => item.rowId === from.y
    );

    const draggedItemColumnIndex = newSorting[
      draggedItemIndex
    ].columns.findIndex((column) => column[indexOfEntry] === draggedItem);

    newSorting[draggedItemIndex].columns[draggedItemColumnIndex].splice(
      indexOfEntry,
      1
    );

    // Add dropped item at the end of the column
    newSorting
      .find((item) => item.rowId === to.y)
      ?.columns[to.x].push(draggedItem!!);

    // Update State
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
      <button className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-darkGrey text-white p-1 rounded-full">
        <Plus width={18} height={18} weight="bold" />
      </button>
    </div>
  );
};
