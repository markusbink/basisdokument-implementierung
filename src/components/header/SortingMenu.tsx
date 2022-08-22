import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ClockClockwise, DotsSixVertical, ListNumbers } from "phosphor-react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useHeaderContext } from "../../contexts";

export const SortingMenu = () => {
  const { sectionList, setSectionList, resetPrivateSorting } = useHeaderContext();
  const [showSortingMenu, setShowSortingdMenu] = useState<Boolean>(false);

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
    <DropdownMenu.Root
      modal={false}
      onOpenChange={() => {
        setShowSortingdMenu(!showSortingMenu);
      }}
    >
      <DropdownMenu.Trigger className={`flex flex-row justify-between bg-darkGrey hover:bg-mediumGrey items-center rounded-md gap-2 pl-2 pr-2 pt-2 pb-2 hover:cursor-pointer font-bold h-8`}>
        <ListNumbers size={24} className="text-white" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content side="bottom" align="start" className="flex flex-col bg-white shadow-md rounded-lg p-4 left-0 top-0 mt-6 max-h-[500px]">
          <div className="flex flex-row gap-4 items-center">
            <p className="font-bold text-xl">Beiträge sortieren</p>
            <div className="bg-darkGrey text-white p-0.5 pl-3 pr-3 rounded-full">Privat</div>
          </div>
          <DragDropContext onDragEnd={handleDrop}>
            <Droppable droppableId="sorting-menu-container">
              {(provided) => (
                <div
                  className="sorting-menu flex flex-col sorting-menu-container gap-2 mt-6 relative overflow-hidden overflow-y-scroll h-max-[400px]"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {sectionList.map((item: { id: string; title_plaintiff: string }, index: number) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
                          <div className="flex flex-row items-center">
                            <DotsSixVertical size={32} />
                            <div className="flex flex-row gap-2 rounded-md p-2 bg-offWhite cursor-default font-bold w-full item-container">
                              <p>{index + 1}.</p>
                              <p>{item.title_plaintiff}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <div className="flex justify-end mt-2">
                    <div
                      className="flex flex-row gap-1 items-center cursor-pointer bg-darkGrey text-white text-[12px] font-bold p-2 rounded-md"
                      onClick={() => {
                        resetPrivateSorting();
                      }}
                    >
                      <ClockClockwise size={20} />
                      <p>Sortierung zurücksetzen</p>
                    </div>
                  </div>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
