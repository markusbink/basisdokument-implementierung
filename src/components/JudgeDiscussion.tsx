import { useDrag, useDrop } from "react-dnd";
import { useCase } from "../contexts";
import cx from "classnames";

export const JudgeDiscussion = () => {
  const { individualEntrySorting } = useCase();

  return (
    <>
      {individualEntrySorting.map((section, y) => (
        <>
          <h3>{section.sectionId}</h3>
          <EntryRow>
            {Object.keys(section.columns).map((column, x) => (
              <DroppableColumn position={{ x, y }}>
                {section.columns[x].map((entryId: string, index) => (
                  <DragEntry
                    entryId={entryId}
                    position={{ x, y }}
                    index={index}
                  />
                ))}
              </DroppableColumn>
            ))}
          </EntryRow>
        </>
      ))}
    </>
  );
};

export enum ItemTypes {
  ENTRY = "entry",
}

const DragEntry = ({
  entryId,
  position,
  index,
}: {
  entryId: string;
  position: { x: number; y: number };
  index: number;
}) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.ENTRY,
      item: { position, index },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [position]
  );

  return (
    <div
      ref={drag}
      className={cx("p-2 bg-black/10", {
        "bg-black/20": isDragging,
      })}>
      {entryId}
    </div>
  );
};

const DroppableColumn = ({
  position,
  children,
}: {
  position: { x: number; y: number };
  children: React.ReactNode;
}) => {
  const { individualEntrySorting, setIndividualEntrySorting } = useCase();

  /**
   * Moves an item from one list to another list.
   * @param from The coordinates of the item to move.
   * @param to The coordinates of the item to move to.
   */
  const moveItem = (
    from: { x: number; y: number },
    to: { x: number; y: number },
    indexInsideColumn: number
  ) => {
    const newSorting = [...individualEntrySorting];
    // Remove dragged item
    const [reorderedEntry] = newSorting[from.y].columns[from.x].splice(
      indexInsideColumn,
      1
    );
    // Add dropped item
    newSorting[to.y].columns[to.x].splice(to.x, 0, reorderedEntry);
    // Update State
    setIndividualEntrySorting(newSorting);
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.ENTRY,
    drop: (_: any, monitor) => {
      const oldPosition = monitor.getItem().position;
      const indexInsideColumn = monitor.getItem().index;
      moveItem(oldPosition, position, indexInsideColumn);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={cx("column p-4 border border-red-500 text-black", {
        "bg-red-100": isOver,
      })}>
      {children}
    </div>
  );
};

const EntryRow = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="p-4 bg-slate-300 text-white rounded-lg border border-slate-400 shadow-lg select-none grid grid-cols-2 gap-6">
      {children}
    </div>
  );
};
