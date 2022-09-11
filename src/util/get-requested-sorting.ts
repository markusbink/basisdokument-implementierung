import { ISection, Sorting } from "../types";

export const getRequestedSorting = (
  sectionList: ISection[],
  individualSorting: string[],
  selectedSorting: Sorting
) => {
  if (selectedSorting === Sorting.Privat) {
    let privateSorting: ISection[] = [];
    individualSorting.forEach((id: string) => {
      let section: any = sectionList.find((section) => section.id === id);
      privateSorting.push(section);
    });
    return privateSorting;
  } else {
    return sectionList;
  }
};
