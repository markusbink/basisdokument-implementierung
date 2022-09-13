import { useCase, useHeaderContext, useSection } from "../contexts";
import { UserRole } from "../types";
import { getOriginalSortingPosition } from "../util/get-original-sorting-position";
import { getRequestedSorting } from "../util/get-requested-sorting";
import { AddEntryButtons } from "./AddEntryButtons";
import { DraggableEntry, DroppableColumn, EntryRow } from "./judge-sorting";
import { SectionHeader } from "./section-header/SectionHeader";

export const JudgeDiscussion = () => {
  const { individualEntrySorting } = useCase();
  const { individualSorting, sectionList } = useSection();
  const { selectedSorting } = useHeaderContext();

  return (
    <>
      {getRequestedSorting(sectionList, individualSorting, selectedSorting).map(
        (section, index) => {
          const entriesForSection = individualEntrySorting[section.id];

          return (
            <div className="space-y-2" key={section.id}>
              <SectionHeader
                sectionId={getOriginalSortingPosition(sectionList, section.id)}
                section={section}
                position={index}
              />
              <div className="space-y-8">
                {entriesForSection?.map((entrySection, index) => {
                  return (
                    <EntryRow
                      key={entrySection.rowId}
                      sectionId={section.id}
                      rowId={entrySection.rowId}
                      hasChildren={entrySection.columns.some(
                        (column) => column.length > 0
                      )}>
                      {Object.keys(entrySection.columns).map((_, x) => (
                        <DroppableColumn
                          key={`${entrySection.rowId}-${x}`}
                          columnRole={
                            x === 0 ? UserRole.Plaintiff : UserRole.Defendant
                          }
                          position={{
                            sectionId: section.id,
                            rowId: entrySection.rowId,
                          }}>
                          {entrySection.columns[x].map(
                            (entryId: string, index) => (
                              <DraggableEntry
                                key={entryId}
                                entryId={entryId}
                                position={{
                                  sectionId: section.id,
                                  rowId: entrySection.rowId,
                                  column: x,
                                }}
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
