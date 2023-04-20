import { useHeaderContext, useSection, useUser } from "../../contexts";
import { getOriginalSortingPosition } from "../../util/get-original-sorting-position";
import { Sorting, UserRole } from "../../types";
import { SortingSelector } from "../header/SortingSelector";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { ClockClockwise, DotsSixVertical } from "phosphor-react";

export const SidebarSorting = () => {
  const { selectedSorting, setSelectedSorting } = useHeaderContext();
  const { sectionList, individualSorting, setIndividualSorting } = useSection();
  let originalSorting = sectionList.map((section) => section.id);
  const { user } = useUser();

  const getSectionObject = (id: string) => {
    let section: any = sectionList.find((section) => section.id === id);
    return section;
  };

  const titleVisible = (title: string) => {
    if (title === "") {
      return false;
    } else {
      return true;
    }
  };

  const resetPrivateSorting = () => {
    let originalSorting = sectionList.map((section) => section.id);
    setIndividualSorting(originalSorting);
  };

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

  return (
    //h-[calc(100vh-56px)] -> overflow scroll needs a fixed height of parent: 56px (height of sidebar header)
    <div className="flex flex-col gap-3 h-[calc(100vh-56px)]">
      <div className="flex flex-row justify-between pt-4 px-4">
        <div className="font-bold text-darkGrey text-lg">Gliederung:</div>
        <div className="content-center">
          <div>
            {user?.role !== UserRole.Client && (
              <SortingSelector
                selectedSorting={selectedSorting}
                setSelectedSorting={setSelectedSorting}
              />
            )}
          </div>
        </div>
      </div>
      <div className="text-darkGrey opacity-40 text-sm px-4">
        {selectedSorting === Sorting.Privat ? (
          <span>
            Die private Sortierung erlaubt Ihnen die Verschiebung einzelner
            Gliederungspunkte mit dem{" "}
            <DotsSixVertical size={14} className="inline" />
            -Icon. Die Sortierung der Gliederung ist nur für Sie sichtbar.
          </span>
        ) : null}
      </div>
      {individualSorting.length <= 0 && (
        <span className="mt-7 text-darkGrey opacity-40 text-center text-sm px-4">
          Es wurden noch keine Gliederungspunkte angelegt.
        </span>
      )}
      <div className="px-4 mb-4 flex-1 overflow-y-scroll scroll-smooth">
        {selectedSorting === Sorting.Privat ? (
          // private sorting
          <>
            <div>
              <DragDropContext onDragEnd={handleDrop}>
                <Droppable droppableId="sorting-menu-sidebar">
                  {(provided) => (
                    <div
                      className="sorting-menu flex flex-col sorting-menu-sidebar gap-2 mt-4"
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
                              {...provided.draggableProps}>
                              <div className="flex flex-row items-center select-none group">
                                <div {...provided.dragHandleProps}>
                                  <DotsSixVertical size={24} />
                                </div>
                                <a
                                  href={`#${section}`}
                                  draggable={false}
                                  className="flex flex-row gap-2 rounded-md p-2 bg-offWhite text-darkGrey font-bold w-full item-container transition-all group-hover:bg-lightGrey text-sm"
                                  onClick={(e) => e.stopPropagation()}>
                                  <span className="self-center">
                                    {`${getOriginalSortingPosition(
                                      sectionList,
                                      getSectionObject(section).id
                                    )}. `}
                                  </span>
                                  {user?.role === UserRole.Judge && (
                                    <div>
                                      <span>
                                        {
                                          getSectionObject(section)
                                            .titlePlaintiff
                                        }
                                      </span>
                                      <div
                                        className={
                                          titleVisible(
                                            getSectionObject(section)
                                              .titlePlaintiff
                                          ) === false ||
                                          titleVisible(
                                            getSectionObject(section)
                                              .titleDefendant
                                          ) === false
                                            ? ""
                                            : "h-0.5 w-24 bg-lightGrey rounded-full my-1"
                                        }
                                      />
                                      <span>
                                        {
                                          getSectionObject(section)
                                            .titleDefendant
                                        }
                                      </span>
                                    </div>
                                  )}
                                  {user?.role === UserRole.Plaintiff && (
                                    <div>
                                      <span>
                                        {
                                          getSectionObject(section)
                                            .titlePlaintiff
                                        }
                                      </span>
                                      <div
                                        className={
                                          titleVisible(
                                            getSectionObject(section)
                                              .titlePlaintiff
                                          ) === false ||
                                          titleVisible(
                                            getSectionObject(section)
                                              .titleDefendant
                                          ) === false
                                            ? ""
                                            : "h-0.5 w-24 bg-lightGrey rounded-full my-1"
                                        }
                                      />
                                      <span className="font-light">
                                        {
                                          getSectionObject(section)
                                            .titleDefendant
                                        }
                                      </span>
                                    </div>
                                  )}
                                  {user?.role === UserRole.Defendant && (
                                    <div>
                                      <span>
                                        {
                                          getSectionObject(section)
                                            .titleDefendant
                                        }
                                      </span>
                                      <div
                                        className={
                                          titleVisible(
                                            getSectionObject(section)
                                              .titlePlaintiff
                                          ) === false ||
                                          titleVisible(
                                            getSectionObject(section)
                                              .titleDefendant
                                          ) === false
                                            ? ""
                                            : "h-0.5 w-24 bg-lightGrey rounded-full my-1"
                                        }
                                      />
                                      <span className="font-light">
                                        {
                                          getSectionObject(section)
                                            .titlePlaintiff
                                        }
                                      </span>
                                    </div>
                                  )}
                                </a>
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
            </div>
            <div>
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
          </>
        ) : (
          // original sorting
          originalSorting.map((sortpoint) => (
            <a
              href={`#${sortpoint}`}
              draggable={false}
              className="flex flex-row gap-2 rounded-md p-2 my-2 text-darkGrey bg-offWhite font-bold w-full item-container text-sm"
              onClick={(e) => e.stopPropagation()}>
              <span className="self-center">
                {getOriginalSortingPosition(
                  sectionList,
                  getSectionObject(sortpoint).id
                )}
                .
              </span>
              <div>
                <span
                  className={
                    user?.role === UserRole.Defendant ? "font-light" : ""
                  }>
                  {getSectionObject(sortpoint).titlePlaintiff}
                </span>
                <div
                  className={
                    titleVisible(getSectionObject(sortpoint).titlePlaintiff) ===
                      false ||
                    titleVisible(getSectionObject(sortpoint).titleDefendant) ===
                      false
                      ? ""
                      : "h-0.5 w-24 bg-lightGrey rounded-full my-1"
                  }
                />
                <span
                  className={
                    user?.role === UserRole.Plaintiff ?  "font-light" : ""
                  }>
                  {getSectionObject(sortpoint).titleDefendant}
                </span>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
};
