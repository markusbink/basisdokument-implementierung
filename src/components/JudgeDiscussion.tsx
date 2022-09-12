import { useCase, useHeaderContext, useSection } from "../contexts";
import { IndividualEntrySortingEntry, UserRole } from "../types";
import { getOriginalSortingPosition } from "../util/get-original-sorting-position";
import { getRequestedSorting } from "../util/get-requested-sorting";
import { AddEntryButtons } from "./AddEntryButtons";
import { DraggableEntry, DroppableColumn, EntryRow } from "./judge-sorting";
import { SectionHeader } from "./section-header/SectionHeader";

export const JudgeDiscussion = () => {
  const { individualEntrySorting } = useCase();
  const { individualSorting, sectionList } = useSection();
  const { selectedSorting } = useHeaderContext();

  console.log({ individualEntrySorting });

  return (
    <>
      {getRequestedSorting(sectionList, individualSorting, selectedSorting).map(
        (section, index) => {
          const entriesForSection: IndividualEntrySortingEntry[] =
            individualEntrySorting.filter(
              (sectionSorting) => sectionSorting.sectionId === section.id
            );

          return (
            <div className="space-y-2" key={section.id}>
              <SectionHeader
                sectionId={getOriginalSortingPosition(sectionList, section.id)}
                section={section}
                position={index}
              />
              <div className="space-y-8">
                {entriesForSection.map((entrySection, y) => {
                  return (
                    <EntryRow key={entrySection.rowId}>
                      {Object.keys(entrySection.columns).map((_, x) => (
                        <DroppableColumn
                          key={`${entrySection.rowId}-${x}`}
                          columnRole={
                            x === 0 ? UserRole.Plaintiff : UserRole.Defendant
                          }
                          position={{ x, y: entrySection.rowId }}>
                          {entrySection.columns[x].map(
                            (entryId: string, index) => (
                              <DraggableEntry
                                key={entryId}
                                entryId={entryId}
                                position={{ x, y: entrySection.rowId }}
                                index={index}
                              />
                            )
                          )}
                        </DroppableColumn>
                      ))}
                    </EntryRow>
                  );
                })}
              </div>
              <AddEntryButtons sectionId={section.id} />
            </div>
          );
        }
      )}
    </>
  );
};

export enum ItemTypes {
  ENTRY = "entry",
}
