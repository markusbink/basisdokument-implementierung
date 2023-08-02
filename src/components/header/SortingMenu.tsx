import { ClockClockwise, DotsSixVertical, SortAscending } from "phosphor-react";
import { useRef, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useSection } from "../../contexts";
import { useUser } from "../../contexts/UserContext";
import { useOutsideClick } from "../../hooks/use-outside-click";
import { UserRole } from "../../types";
import { getOriginalSortingPosition } from "../../util/get-original-sorting-position";

// drag menu platzieren bei doppeltem titel (zentrieren)
// update on entry add

export const SortingMenu = () => {
  const { sectionList, individualSorting, setIndividualSorting } = useSection();
  const [showSortingMenu, setShowSortingMenu] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dropdownRef, () => setShowSortingMenu(false));
  const { user } = useUser();

  const handleDrop = (droppedItem: any) => {
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;
    const updatedList = [...individualSorting];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    // Update State
    setIndividualSorting(updatedList);
  };

  const getSectionObject = (id: string) => {
    let section: any = sectionList.find((section) => section.id === id);
    return section;
  };

  const resetPrivateSorting = () => {
    let originalSorting = sectionList.map((section) => section.id);
    setIndividualSorting(originalSorting);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setShowSortingMenu(!showSortingMenu)}
        className={`flex flex-row justify-between bg-offWhite hover:bg-lightGrey items-center rounded-md gap-2 pl-2 pr-2 pt-2 pb-2 hover:cursor-pointer font-bold h-8`}>
        <SortAscending size={22} className="text-darkGrey" />
      </button>
      {showSortingMenu ? (
        <div className="absolute top-full flex flex-col bg-white shadow-md rounded-lg p-3 left-0 mt-6 w-[350px] z-50">
          <div className="flex gap-4 items-center justify-between">
            <span className="font-bold text-base">
              Gliederungspunkte sortieren
            </span>
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
                  ref={provided.innerRef}>
                  {individualSorting.map((section, index) => (
                    <Draggable
                      key={getSectionObject(section).id}
                      draggableId={getSectionObject(section).id}
                      index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}>
                          <div className="flex flex-row items-center select-none group">
                            <DotsSixVertical size={24} />
                            <div className="flex flex-row gap-2 rounded-md p-2 bg-offWhite font-bold w-full item-container transition-all group-hover:bg-lightGrey text-sm">
                              <span>
                                {`${getOriginalSortingPosition(
                                  sectionList,
                                  getSectionObject(section).id
                                )}. `}
                              </span>
                              {user?.role === UserRole.Judge && (
                                <div>
                                  <span>
                                    {getSectionObject(section).titlePlaintiff}
                                  </span>
                                  <br />
                                  <span>
                                    {getSectionObject(section).titleDefendant}
                                  </span>
                                </div>
                              )}
                              {user?.role === UserRole.Plaintiff && (
                                <div>
                                  <span>
                                    {getSectionObject(section).titlePlaintiff}
                                  </span>
                                  <br />
                                  <span className="font-light">
                                    {getSectionObject(section).titleDefendant}
                                  </span>
                                </div>
                              )}
                              {user?.role === UserRole.Defendant && (
                                <div>
                                  <span>
                                    {getSectionObject(section).titleDefendant}
                                  </span>
                                  <br />
                                  <span className="font-light">
                                    {getSectionObject(section).titlePlaintiff}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {sectionList.length === 0 ? (
                    <div className="flex justify-center items-center p-8">
                      <p className="text-mediumGrey opacity-70 text-center text-sm w-48">
                        Es wurden noch keine Gliederungspunkte angelegt.
                      </p>
                    </div>
                  ) : null}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          {sectionList.length !== 0 ? (
            <div className="flex justify-end mt-2">
              <div
                className="flex flex-row gap-1 items-center cursor-pointer bg-darkGrey hover:bg-mediumGrey text-white text-[10px] font-bold px-1.5 py-1 rounded-md"
                onClick={() => {
                  resetPrivateSorting();
                }}>
                <ClockClockwise size={16} />
                <span>Sortierung zurücksetzen</span>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
