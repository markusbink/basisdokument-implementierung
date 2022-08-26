import { ISection } from "../types";

export const getOriginalSortingPosition = (
  sectionList: ISection[],
  sectionId: string
) => {
  const position = sectionList.findIndex(function (section) {
    return section.id === sectionId;
  });
  return position + 1;
};
