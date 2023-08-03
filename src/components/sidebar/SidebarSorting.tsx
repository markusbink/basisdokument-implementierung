import { useCase, useHeaderContext, useSection, useUser } from "../../contexts";
import { getOriginalSortingPosition } from "../../util/get-original-sorting-position";
import { ISection, Sorting, UserRole } from "../../types";
import { SortingSelector } from "../header/SortingSelector";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  CaretDown,
  CaretUp,
  ClockClockwise,
  DotsSixVertical,
} from "phosphor-react";
import cx from "classnames";
import { getTheme } from "../../themes/getTheme";
import { useEffect, useState } from "react";

export const SidebarSorting = () => {
  const { selectedSorting, setSelectedSorting, selectedTheme } =
    useHeaderContext();
  const { sectionList, individualSorting, setIndividualSorting } = useSection();
  let originalSorting = sectionList.map((section) => section.id);

  const { user } = useUser();
  const { entries } = useCase();
  const [allExpanded, setAllExpanded] = useState<boolean>(true);
  const [sectionExpandedPairs, setSectionExpandedPairs] = useState<
    { section: string; visible: boolean }[]
  >(
    originalSorting.map((sortpoint: string) => {
      return { section: sortpoint, visible: true };
    })
  );

  const getSectionObject = (id: string) => {
    let section: ISection = sectionList.find((section) => section.id === id)!;
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

  const getPlainText = (entryText: string) => {
    return new DOMParser().parseFromString(entryText, "text/html")
      .documentElement.textContent;
  };

  const toggleAllEntries = () => {
    const newVisibility = !sectionExpandedPairs.some((pair) => pair.visible);
    const updated = sectionExpandedPairs.map((entrVisib) =>
      entrVisib.visible !== newVisibility
        ? { section: entrVisib.section, visible: newVisibility }
        : entrVisib
    );
    setSectionExpandedPairs(updated);
  };

  useEffect(() => {
    const newlyAddedSections = sectionList.filter(
      (section) =>
        !sectionExpandedPairs.map((ev) => ev.section).includes(section.id)
    );
    const updated = sectionExpandedPairs.concat(
      newlyAddedSections.map((section) => {
        return { section: section.id, visible: true };
      })
    );
    setSectionExpandedPairs(updated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionList]);

  return (
    //h-[calc(100vh-56px)] -> overflow scroll needs a fixed height of parent: 56px (height of sidebar header) */}
    <div className="flex flex-col gap-3 h-[calc(100vh-56px)]">
      <div className="flex flex-row justify-between pt-4 px-4">
        <div className="font-bold text-darkGrey text-lg">Gliederung</div>
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
      <div
        className={cx(
          "self-end px-6 text-sm hover:underline hover:cursor-pointer",
          { "-mb-2": selectedSorting === Sorting.Original }
        )}
        onClick={() => {
          toggleAllEntries();
          setAllExpanded(!allExpanded);
        }}>
        {`Alle ${
          sectionExpandedPairs.some((pair) => pair.visible) ? "ein" : "aus"
        }klappen`}
      </div>
      <div className="px-4 pb-12 mb-2 flex-1 overflow-y-scroll scroll-smooth">
        {selectedSorting === Sorting.Privat ? (
          // private sorting
          <>
            <div>
              <DragDropContext onDragEnd={handleDrop}>
                <Droppable droppableId="sorting-menu-sidebar">
                  {(provided) => (
                    <div
                      className="sorting-menu flex flex-col sorting-menu-sidebar gap-2"
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
                              <div className="flex flex-row select-none group">
                                <div {...provided.dragHandleProps}>
                                  <DotsSixVertical
                                    size={24}
                                    className={cx("", {
                                      "mt-5":
                                        getSectionObject(section)
                                          .titlePlaintiff &&
                                        getSectionObject(section)
                                          .titleDefendant,
                                      "mt-1":
                                        !getSectionObject(section)
                                          .titlePlaintiff ||
                                        !getSectionObject(section)
                                          .titleDefendant,
                                    })}
                                  />
                                </div>
                                <div className="w-full">
                                  <div className="flex rounded-md p-2 bg-offWhite hover:bg-lightGrey items-center">
                                    <a
                                      href={`#${section}`}
                                      draggable={false}
                                      key={getSectionObject(section).id}
                                      className="flex flex-row gap-2 font-bold w-full item-container text-darkGrey transition-all text-sm"
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
                                    {sectionExpandedPairs.find(
                                      (entrVisib) =>
                                        entrVisib.section === section
                                    )?.visible ? (
                                      <CaretUp
                                        size={12}
                                        className="text-darkGrey cursor-pointer"
                                        weight="bold"
                                        onClick={() => {
                                          const updated =
                                            sectionExpandedPairs.map(
                                              (entrVisib) =>
                                                entrVisib.section === section
                                                  ? {
                                                      section:
                                                        entrVisib.section,
                                                      visible: false,
                                                    }
                                                  : entrVisib
                                            );
                                          setSectionExpandedPairs(updated);
                                        }}
                                      />
                                    ) : (
                                      <CaretDown
                                        size={12}
                                        className="text-darkGrey cursor-pointer"
                                        weight="bold"
                                        onClick={() => {
                                          const updated =
                                            sectionExpandedPairs.map(
                                              (entrVisib) =>
                                                entrVisib.section === section
                                                  ? {
                                                      section:
                                                        entrVisib.section,
                                                      visible: true,
                                                    }
                                                  : entrVisib
                                            );
                                          setSectionExpandedPairs(updated);
                                        }}
                                      />
                                    )}
                                  </div>
                                  {sectionExpandedPairs.find(
                                    (entrVisib) => entrVisib.section === section
                                  )?.visible &&
                                    entries
                                      .filter(
                                        (entry) => entry.sectionId === section
                                      )
                                      .map((entry) => {
                                        return entry ? (
                                          <a
                                            key={entry.entryCode}
                                            href={`#${entry.entryCode}`}
                                            className="ml-5 mt-1 px-2 py-1 flex gap-2 bg-offWhite hover:bg-lightGrey rounded-md text-darkGrey font-normal">
                                            <span
                                              className={cx(
                                                "self-center text-xs rounded-full p-1 w-fit px-3 font-semibold",
                                                {
                                                  [`bg-${
                                                    getTheme(selectedTheme)
                                                      ?.primaryPlaintiff
                                                  } text-${
                                                    getTheme(selectedTheme)
                                                      ?.secondaryPlaintiff
                                                  }`]:
                                                    entry.entryCode?.charAt(
                                                      0
                                                    ) === "B",
                                                  [`bg-${
                                                    getTheme(selectedTheme)
                                                      ?.primaryDefendant
                                                  } text-${
                                                    getTheme(selectedTheme)
                                                      ?.secondaryDefendant
                                                  }`]:
                                                    entry.entryCode?.charAt(
                                                      0
                                                    ) === "K",
                                                }
                                              )}>
                                              {entry.entryCode}
                                            </span>
                                            <span>
                                              {getPlainText(entry.text) &&
                                              getPlainText(entry.text)!.length >
                                                20
                                                ? getPlainText(
                                                    entry.text
                                                  )?.slice(0, 20) + " ..."
                                                : getPlainText(entry.text)}
                                            </span>
                                          </a>
                                        ) : null;
                                      })}
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
            </div>
            {sectionList.length !== 0 && (
              <div className="absolute right-0 bottom-1 w-fit bg-white px-2 py-1">
                <div
                  className="flex gap-1 items-center cursor-pointer bg-darkGrey hover:bg-mediumGrey text-white text-xs p-1.5 rounded-md"
                  onClick={() => {
                    resetPrivateSorting();
                  }}>
                  <ClockClockwise size={16} />
                  <span>Sortierung zurücksetzen</span>
                </div>
              </div>
            )}
          </>
        ) : (
          // original sorting
          originalSorting.map((sortpoint) => (
            <div key={sortpoint}>
              <div className="flex bg-offWhite hover:bg-lightGrey rounded-md p-2 my-2 items-center">
                <a
                  href={`#${sortpoint}`}
                  draggable={false}
                  key={getSectionObject(sortpoint).id}
                  className="flex flex-row gap-2 text-darkGrey font-bold w-full item-container text-sm"
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
                      {getSectionObject(sortpoint)!.titlePlaintiff}
                    </span>
                    <div
                      className={
                        titleVisible(
                          getSectionObject(sortpoint).titlePlaintiff
                        ) === false ||
                        titleVisible(
                          getSectionObject(sortpoint).titleDefendant
                        ) === false
                          ? ""
                          : "h-0.5 w-24 bg-lightGrey rounded-full my-1"
                      }
                    />
                    <span
                      className={
                        user?.role === UserRole.Plaintiff ? "font-light" : ""
                      }>
                      {getSectionObject(sortpoint).titleDefendant}
                    </span>
                  </div>
                </a>
                {sectionExpandedPairs.find(
                  (entrVisib) => entrVisib.section === sortpoint
                )?.visible ? (
                  <CaretUp
                    size={12}
                    className="text-darkGrey cursor-pointer"
                    weight="bold"
                    onClick={() => {
                      const updated = sectionExpandedPairs.map((entrVisib) =>
                        entrVisib.section === sortpoint
                          ? { section: entrVisib.section, visible: false }
                          : entrVisib
                      );
                      setSectionExpandedPairs(updated);
                    }}
                  />
                ) : (
                  <CaretDown
                    size={12}
                    className="text-darkGrey cursor-pointer"
                    weight="bold"
                    onClick={() => {
                      const updated = sectionExpandedPairs.map((entrVisib) =>
                        entrVisib.section === sortpoint
                          ? { section: entrVisib.section, visible: true }
                          : entrVisib
                      );
                      setSectionExpandedPairs(updated);
                    }}
                  />
                )}
              </div>

              {sectionExpandedPairs.find(
                (entrVisib) => entrVisib.section === sortpoint
              )?.visible &&
                entries
                  .filter((entry) => entry.sectionId === sortpoint)
                  .map((entry) => {
                    return entry ? (
                      <a
                        key={entry.entryCode}
                        href={`#${entry.entryCode}`}
                        className="ml-5 mt-1 px-2 py-1 flex gap-2 bg-offWhite hover:bg-lightGrey rounded-md text-darkGrey font-normal">
                        <span
                          className={cx(
                            "self-center text-xs rounded-full p-1 w-fit px-3 font-semibold",
                            {
                              [`bg-${
                                getTheme(selectedTheme)?.primaryPlaintiff
                              } text-${
                                getTheme(selectedTheme)?.secondaryPlaintiff
                              }`]: entry.entryCode?.charAt(0) === "B",
                              [`bg-${
                                getTheme(selectedTheme)?.primaryDefendant
                              } text-${
                                getTheme(selectedTheme)?.secondaryDefendant
                              }`]: entry.entryCode?.charAt(0) === "K",
                            }
                          )}>
                          {entry.entryCode}
                        </span>
                        <span>
                          {getPlainText(entry.text) &&
                          getPlainText(entry.text)!.length > 20
                            ? getPlainText(entry.text)?.slice(0, 20) + " ..."
                            : getPlainText(entry.text)}
                        </span>
                      </a>
                    ) : null;
                  })}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
