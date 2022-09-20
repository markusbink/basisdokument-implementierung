import cx from "classnames";
import { useCallback, useRef } from "react";
import { useDrag, useDrop, XYCoord } from "react-dnd";
import { useBookmarks, useCase, useUser } from "../../contexts";
import { getEntryById } from "../../contexts/CaseContext";
import { IDragItemType, UserRole } from "../../types";
import { Entry } from "../entry";

interface DraggableEntryProps {
  entryId: string;
  position: { sectionId: string; rowId: string; column: number };
  index: number;
}

export const DraggableEntry: React.FC<DraggableEntryProps> = ({
  entryId,
  position,
  index,
}) => {
  const { user } = useUser();
  const { entries, currentVersion, setIndividualEntrySorting } = useCase();
  const { bookmarks } = useBookmarks();

  const entry = getEntryById(entries, entryId);
  const ref = useRef<HTMLDivElement>(null);

  const moveEntry = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setIndividualEntrySorting((prevEntrySorting) => {
        const newSorting = { ...prevEntrySorting };

        Object.keys(newSorting).map((sectionId) => {
          if (sectionId !== position.sectionId) {
            return newSorting[sectionId];
          }

          return newSorting[sectionId].map((row) => {
            // Remove item by hover index
            const draggedItem = row.columns[position.column].splice(
              dragIndex,
              1
            )[0];

            if (!draggedItem) {
              return row;
            }

            // Add item to the new index
            return row.columns[position.column].splice(
              hoverIndex,
              0,
              draggedItem
            );
          });
        });

        return newSorting;
      });
    },
    [position, setIndividualEntrySorting]
  );

  interface DragItem {
    position: { sectionId: string; rowId: string; column: number };
    index: number;
    role: UserRole;
  }

  const [{ isDragging }, drag] = useDrag({
    type: IDragItemType.ENTRY,
    item: { position, index, role: entry?.role },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ handlerId, isOver, canDrop }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: any; isOver: boolean; canDrop: boolean }
  >({
    accept: IDragItemType.ENTRY,
    canDrop(_: any, monitor) {
      return (
        monitor.getItem().index !== index &&
        monitor.getItem().position.rowId === position.rowId
      );
    },
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveEntry(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={cx({
        "outline-dotted outline-offset-4 rounded cursor-grabbing": isDragging,
        "cursor-grab": !isDragging,
        "opacity-50": isOver && canDrop,
      })}
      data-handler-id={handlerId}>
      <>
        {entry && (
          <Entry
            viewedBy={user!.role}
            entry={entry}
            isOld={entry.version < currentVersion}
            isBookmarked={
              !!bookmarks.find(
                (bookmark) => bookmark.associatedEntry === entry.id
              )
            }
          />
        )}
      </>
    </div>
  );
};
