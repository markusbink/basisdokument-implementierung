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
  let individualEntrySortingFromEditFile: IndividualEntrySortingEntry[] = [];

  for (const i in editFileObject["individualSorting"]) {
    sortingsFromEditFile.push(editFileObject["individualSorting"][i]);
  }

  for (const i in basisdokumentObject["sections"]) {
    sortingsOriginalOrderFromBasisdokumentFile.push(
      basisdokumentObject["sections"][i].id
    );
  }

  for (const i in editFileObject["individualEntrySorting"]) {
    individualEntrySortingFromEditFile.push(
      editFileObject["individualEntrySorting"][i]
    );
  }

  for (const i in basisdokumentObject["entries"]) {
    entries.push(basisdokumentObject["entries"][i]);
  }

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
    // if the entry is not in the columns of the individualEntrySorting, we need to add it
    const columnIndex = entry.role === UserRole.Plaintiff ? 0 : 1;

    if (
      !individualEntrySortingFromEditFile.some((individualEntry) =>
        individualEntry.columns[columnIndex].includes(entry.id)
      )
    ) {
      const individualEntrySortingEntry: IndividualEntrySortingEntry = {
        sectionId: entry.sectionId,
        rowId: uuidv4(),
        columns: [[], []],
      };
      individualEntrySortingEntry.columns[columnIndex].push(entry.id);
      individualEntrySortingFromEditFile.push(individualEntrySortingEntry);
    }
  });

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
