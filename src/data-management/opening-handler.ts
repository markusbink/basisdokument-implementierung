import { IStateUserInput } from "../types";

function updateSortingsIfVersionIsDifferent(
  basisdokumentObject: any,
  editFileObject: any
) {
  let sortingsOriginalOrderFromBasisdokumentFile: string[] = [];
  let sortingsFromEditFile: string[] = [];

  for (const i in editFileObject["individualSorting"]) {
    sortingsFromEditFile.push(editFileObject["individualSorting"][i]);
  }

  for (const i in basisdokumentObject["sections"]) {
    sortingsOriginalOrderFromBasisdokumentFile.push(
      basisdokumentObject["sections"][i].id
    );
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
  editFileObject["individualSorting"] = sortingsFromEditFile;
  return editFileObject;
}

export function jsonToObject(json:string) {
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

  if (
    basisdokumentObject["currentVersion"] !== editFileObject["currentVersion"]
  ) {
    editFileObject = updateSortingsIfVersionIsDifferent(
      basisdokumentObject,
      editFileObject
    );
  }

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
