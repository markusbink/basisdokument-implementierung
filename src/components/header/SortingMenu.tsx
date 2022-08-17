import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { DotsSixVertical, ListNumbers } from "phosphor-react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

export const SortingMenu = ({}) => {
  const [showSortingMenu, setShowDownloadMenu] = useState<Boolean>(false);
  const buttonColor: String = showSortingMenu ? "bg-[#565656]" : "bg-darkGrey";

  const sections = [
    { id: "2b835162-1d32-11ed-861d-0242ac120001", index: 1, title_plaintiff: "Beschreibung zum Unfall" },
    { id: "2b835162-1d32-11ed-861d-0242ac120002", index: 2, title_plaintiff: "Klärung der Unfallbeteiligten" },
    { id: "2b835162-1d32-11ed-861d-0242ac120003", index: 3, title_plaintiff: "Verstoß gegen Drogenpflicht" },
    { id: "2b835162-1d32-11ed-861d-0242ac120004", index: 4, title_plaintiff: "Verstoß gegen Gurtpflicht" },
    { id: "2b835162-1d32-11ed-861d-0242ac120005", index: 5, title_plaintiff: "Alkohol am Steuer" },
    { id: "2b835162-1d32-11ed-861d-0242ac120006", index: 6, title_plaintiff: "Mieterrecht" },
    { id: "2b835162-1d32-11ed-861d-0242ac120007", index: 7, title_plaintiff: "Verstoß gegen Gurkenpflicht" },
  ];

  const [sectionList, setSectionList] = useState(sections);

  const handleDrop = (droppedItem: any) => {
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;
    var updatedList = [...sectionList];
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
        setShowDownloadMenu(!showSortingMenu);
      }}
    >
      <DropdownMenu.Trigger className={`${buttonColor} flex flex-row justify-between bg-darkGrey items-center rounded-md gap-2 pl-2 pr-2 pt-2 pb-2 hover:cursor-pointer font-bold h-8`}>
        <ListNumbers size={24} className="text-white" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content side="bottom" align="start" className="flex flex-col bg-white shadow-md h-screen rounded-lg p-4 left-0 top-0">
          <div className="flex flex-row gap-4 items-center">
            <p className="font-bold text-xl">Beiträge sortieren</p>
            <div className="bg-darkGrey text-white p-0.5 pl-3 pr-3 rounded-full">Privat</div>
          </div>
          <DragDropContext onDragEnd={handleDrop}>
            <Droppable droppableId="sorting-menu-container">
              {(provided) => (
                <div
                  className="flex flex-col sorting-menu-container gap-2 mt-6 relative overflow-hidden overflow-y-scroll h-max-[400px]"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {sectionList.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
                          <div className="flex flex-row items-center">
                            <DotsSixVertical size={32} />
                            <div className="flex flex-row rounded-md p-2 bg-offWhite font-bold w-full item-container">
                              <p className="w-8">{item.index}.</p>
                              <p>{item.title_plaintiff}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
