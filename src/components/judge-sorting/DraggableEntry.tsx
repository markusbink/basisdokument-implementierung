import cx from "classnames";
import { useCallback, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
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

  const [{ handlerId, isOver }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: any; isOver: boolean }
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
        isOver: !!monitor.isOver() && monitor.getItem().index !== index,
      };
    },
    drop(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      moveEntry(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={cx({
        "cursor-grab": !isDragging,
        "cursor-grabbing": isDragging,
        "opacity-50 offset-2 outline-dashed rounded-lg": isOver,
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
