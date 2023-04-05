import {
  IEntry,
  IndividualEntrySortingEntry,
  IStateUserInput,
  UserRole,
} from "../types";
import { v4 as uuidv4 } from "uuid";

export function updateSortingsIfVersionIsDifferent(
  basisdokumentObject: any,
  editFileObject: any
) {
  let sortingsOriginalOrderFromBasisdokumentFile: string[] = [];
  let sortingsFromEditFile: string[] = [];
  let entries: IEntry[] = [];
  let individualEntrySortingFromEditFile: {
    [key: string]: IndividualEntrySortingEntry[];
  } = {};

  for (const i in editFileObject["individualSorting"]) {
    sortingsFromEditFile.push(editFileObject["individualSorting"][i]);
  }

  for (const i in basisdokumentObject["sections"]) {
    sortingsOriginalOrderFromBasisdokumentFile.push(
      basisdokumentObject["sections"][i].id
    );
  }

  individualEntrySortingFromEditFile =
    editFileObject["individualEntrySorting"] || {};
  entries = basisdokumentObject["entries"];

  // we need to add sections in the edit file that are in the uploaded basisdokument but not in the edit file
  sortingsOriginalOrderFromBasisdokumentFile.forEach((key) => {
    if (!sortingsFromEditFile.includes(key)) {
      sortingsFromEditFile.push(key);
    }
  });

  // we need to delete sections from the edit file that are not in the uploaded basisdokument
  sortingsFromEditFile.forEach((key) => {
    if (!sortingsOriginalOrderFromBasisdokumentFile.includes(key)) {
      sortingsFromEditFile = sortingsFromEditFile.filter((e) => e !== key);
    }
  });

  // add rows to individualEntrySorting that are in the uploaded basisdokument but not in the edit file
  entries.forEach((entry) => {
    const columnIndex = entry.role === UserRole.Plaintiff ? 0 : 1;

    // if the entry is not in the columns of the individualEntrySorting, we need to add it
    if (
      !individualEntrySortingFromEditFile[entry.sectionId]?.some(
        (individualEntry) =>
          individualEntry.columns.some((column) => column.includes(entry.id))
      )
    ) {
      const entrySorting: IndividualEntrySortingEntry = {
        rowId: uuidv4(),
        columns: [[], []],
      };

      entrySorting.columns[columnIndex].push(entry.id);
      individualEntrySortingFromEditFile[entry.sectionId]?.push(entrySorting);
    }
  });

  // Remove entryIds from columns of the individualEntrySorting that are not in the uploaded basisdokument entries
  individualEntrySortingFromEditFile = Object.keys(
    individualEntrySortingFromEditFile
  ).reduce((acc, sectionId) => {
    const entrySorting: IndividualEntrySortingEntry[] =
      individualEntrySortingFromEditFile[sectionId];

    const entryIds = entries
      .filter((entry) => entry.sectionId === sectionId)
      .map((entry) => entry.id);

    const newEntrySorting = entrySorting.map((entrySorting) => {
      const newColumns = entrySorting.columns.map((column) => {
        return column.filter((entryId) => entryIds.includes(entryId));
      });

      return {
        ...entrySorting,
        columns: newColumns,
      };
    });

    return {
      ...acc,
      [sectionId]: newEntrySorting,
    } as { [key: string]: IndividualEntrySortingEntry[] };
  }, individualEntrySortingFromEditFile);

  // Remove empty rows from individualEntrySorting
  individualEntrySortingFromEditFile = Object.keys(
    individualEntrySortingFromEditFile
  ).reduce((acc, sectionId) => {
    const entrySorting = individualEntrySortingFromEditFile[sectionId];

    const newEntrySorting = entrySorting.filter((entrySorting) => {
      return entrySorting.columns.some((column) => column.length > 0);
    });

    return {
      ...acc,
      [sectionId]: newEntrySorting,
    } as { [key: string]: IndividualEntrySortingEntry[] };
  }, individualEntrySortingFromEditFile);

  editFileObject["individualSorting"] = sortingsFromEditFile;
  editFileObject["individualEntrySorting"] = individualEntrySortingFromEditFile;

  return editFileObject;
}

export function jsonToObject(json: string) {
  return JSON.parse(json);
}

export function openBasisdokument(
  jsonStringBasisdokument: string,
  newVersionMode: IStateUserInput["newVersionMode"],
  prename: IStateUserInput["prename"],
  surname: IStateUserInput["surname"],
  role: IStateUserInput["role"]
) {
  const basisdokumentObject: any = jsonToObject(jsonStringBasisdokument);
  if (newVersionMode) {
    basisdokumentObject["currentVersion"] = basisdokumentObject[
      "currentVersion"
    ] += 1;
    basisdokumentObject["versions"].push({
      author: prename + " " + surname,
      role: role,
      timestamp: "",
    });
  } else {
    basisdokumentObject["versions"][basisdokumentObject["versions"].length - 1][
      "author"
    ] = prename + " " + surname;
    basisdokumentObject["versions"][basisdokumentObject["versions"].length - 1][
      "role"
    ] = role;
  }
  return basisdokumentObject;
}

export function openEditFile(
  jsonStringBasisdokument: string,
  jsonStringEditFile: string,
  newVersionMode: IStateUserInput["newVersionMode"]
) {
  let basisdokumentObject: any = JSON.parse(jsonStringBasisdokument);
  let editFileObject: any = JSON.parse(jsonStringEditFile);

  editFileObject = updateSortingsIfVersionIsDifferent(
    basisdokumentObject,
    editFileObject
  );

  // After we updated the versions, we can set the version of the editFile to the same version as the version of the Basisdokument
  if (newVersionMode) {
    editFileObject["currentVersion"] = basisdokumentObject[
      "currentVersion"
    ] += 1;
  } else {
    editFileObject["currentVersion"] = basisdokumentObject["currentVersion"];
  }

  return editFileObject;
}
