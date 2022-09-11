import { useDrag } from "react-dnd";
import { useCase, useUser } from "../../contexts";
import { getEntryById } from "../../contexts/CaseContext";
import { IDragItemType } from "../../types";
import { Entry } from "../entry";
import cx from "classnames";

export const DraggableEntry = ({
  entryId,
  position,
  index,
}: {
  entryId: string;
  position: { x: number; y: string };
  index: number;
}) => {
  const { user } = useUser();
  const { entries } = useCase();
  const entry = getEntryById(entries, entryId);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: IDragItemType.ENTRY,
      item: { position, index, role: entry?.role },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [position]
  );

  return (
    <div
      ref={drag}
      className={cx({
        "outline-dotted outline-offset-4 rounded": isDragging,
      })}>
      <>{entry && <Entry viewedBy={user!.role} entry={entry} />}</>
    </div>
  );
};
