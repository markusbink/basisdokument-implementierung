import { ClockClockwise, DotsSixVertical, ListNumbers } from "phosphor-react";
import { useRef, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useHeaderContext } from "../../contexts";
import { useOutsideClick } from "../../hooks/use-outside-click";

export const SortingMenu = () => {
  const { sectionList, setSectionList, resetPrivateSorting } =
    useHeaderContext();
  const [showSortingMenu, setShowSortingMenu] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dropdownRef, () => setShowSortingMenu(false));

  const handleDrop = (droppedItem: any) => {
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;
    const updatedList = [...sectionList];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    // Update State
    setSectionList(updatedList);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setShowSortingMenu(!showSortingMenu)}
        className={`flex flex-row justify-between bg-darkGrey hover:bg-mediumGrey items-center rounded-md gap-2 pl-2 pr-2 pt-2 pb-2 hover:cursor-pointer font-bold h-8`}
      >
        <ListNumbers size={24} className="text-white" />
      </button>
      {showSortingMenu ? (
        <div className="absolute top-full flex flex-col bg-white shadow-md rounded-lg p-3 left-0 mt-6 w-[300px] z-50">
          <div className="flex gap-4 items-center justify-between">
            <p className="font-bold text-base">Beiträge sortieren</p>
            <span className="bg-darkGrey text-white text-xs p-0.5 pl-2 pr-2 rounded-full">
              Privat
            </span>
          </div>
          <DragDropContext onDragEnd={handleDrop}>
            <Droppable droppableId="sorting-menu-container">
              {(provided) => (
                <div
                  className="sorting-menu flex flex-col sorting-menu-container gap-2 mt-4 relative overflow-hidden overflow-y-scroll max-h-[300px]"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {sectionList.map(
                    (
                      item: { id: string; title_plaintiff: string },
                      index: number
                    ) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                          >
                            <div className="flex flex-row items-center select-none group">
                              <DotsSixVertical size={24} />
                              <div className="flex flex-row gap-2 rounded-md p-2 bg-offWhite font-bold w-full item-container transition-all group-hover:bg-lightGrey text-sm">
                                <span>{index + 1}.</span>
                                <span>{item.title_plaintiff}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    )
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <div className="flex justify-end mt-2">
            <div
              className="flex flex-row gap-1 items-center cursor-pointer bg-darkGrey hover:bg-mediumGrey text-white text-[10px] font-bold p-1 rounded-md"
              onClick={() => {
                resetPrivateSorting();
              }}
            >
              <ClockClockwise size={16} />
              <p>Sortierung zurücksetzen</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
