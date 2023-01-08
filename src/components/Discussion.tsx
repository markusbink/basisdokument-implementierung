import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useCase, useHeaderContext, useSection } from "../contexts";
import { Sorting, UserRole } from "../types";
import { getOriginalSortingPosition } from "../util/get-original-sorting-position";
import { getRequestedSorting } from "../util/get-requested-sorting";
import { AddEntryButtons } from "./AddEntryButtons";
import { AddSection } from "./AddSection";
import { EntryList } from "./entry";
import { JudgeDiscussion } from "./JudgeDiscussion";
import { MetaData } from "./metadata/MetaData";
import { SectionHeader } from "./section-header/SectionHeader";

export const Discussion = () => {
  const { groupedEntries } = useCase();
  const { sectionList, individualSorting } = useSection();

  const {
    selectedSorting,
    selectedVersion,
    versionHistory,
    highlightElementsWithSpecificVersion,
    showEntrySorting,
  } = useHeaderContext();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-offWhite h-full overflow-y-scroll py-28 px-4 space-y-4 scroll-smooth">
        <div className="max-w-[1200px] m-auto">
          {highlightElementsWithSpecificVersion ? (
            <div className="flex justify-center z-[30] relative">
              <div className="fixed flex justify-center items-center -mt-24">
                <div className="flex flex-row items-center justify-center gap-4 bg-blue-600 bg-opacity-80 text-white p-2 px-3 rounded-md">
                  <div>
                    <div className="w-4 h-4 border-blue-200 border-2 rounded-full"></div>
                  </div>
                  <span>
                    Beiträge, die in{" "}
                    <b>
                      Version {selectedVersion + 1} (
                      {versionHistory[selectedVersion].author})
                    </b>{" "}
                    hinzugefügt wurden, werden mit einem blauen Rahmen
                    hervorgehoben.
                  </span>
                </div>
              </div>
            </div>
          ) : null}
          <div className="grid grid-cols-2 gap-6 mb-16">
            <MetaData owner={UserRole.Plaintiff} />
            <MetaData owner={UserRole.Defendant} />
          </div>
          {selectedSorting === Sorting.Privat && showEntrySorting ? (
            <JudgeDiscussion />
          ) : (
            <>
              {getRequestedSorting(
                sectionList,
                individualSorting,
                selectedSorting
              ).map((section, index) => {
                const sectionEntries = groupedEntries[section.id];

                return (
                  <>
                    <AddSection sectionIdAfter={section.id} />
                    <div key={section.id}>
                      <SectionHeader
                        sectionId={getOriginalSortingPosition(
                          sectionList,
                          section.id
                        )}
                        section={section}
                        position={index}
                      />
                      <div className="space-y-4">
                        <EntryList
                          entriesList={sectionEntries?.parent || []}
                          sectionId={section.id}
                        />

                        <AddEntryButtons sectionId={section.id} />
                      </div>
                    </div>
                  </>
                );
              })}
            </>
          )}
          <AddSection />
        </div>
      </div>
    </DndProvider>
  );
};
