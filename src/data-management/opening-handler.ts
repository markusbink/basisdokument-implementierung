import { IStateUserInput } from "../types";

function updateSortingsIfVersionIsDifferent(basisdokumentObject: any, editFileObject: any) {
  // console.log("sections bd file", basisdokumentObject["sections"]);
  // console.log("sections edit file", editFileObject["individualSorting"]);

  var sortingsOriginalOrderFromBasisdokumentFile: string[] = [];
  var sortingsFromEditFile: string[] = [];

  for (const i in editFileObject["individualSorting"]) {
    sortingsFromEditFile.push(editFileObject["individualSorting"][i]);
  }

  for (const i in basisdokumentObject["sections"]) {
    sortingsOriginalOrderFromBasisdokumentFile.push(basisdokumentObject["sections"][i].id);
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

  console.log(sortingsOriginalOrderFromBasisdokumentFile, sortingsFromEditFile);

  return editFileObject;
}

export function openBasisdokument(
  jsonStringBasisdokument: string,
  newVersionMode: IStateUserInput["newVersionMode"],
  prename: IStateUserInput["prename"],
  surname: IStateUserInput["surname"],
  role: IStateUserInput["role"]
) {
  let basisdokumentObject: any = JSON.parse(jsonStringBasisdokument);
  if (newVersionMode) {
    basisdokumentObject["currentVersion"] = basisdokumentObject["currentVersion"] += 1;
    basisdokumentObject["versions"].push({ author: prename + " " + surname, role: role, timestamp: "" });
  } else {
    basisdokumentObject["versions"][basisdokumentObject["versions"].length - 1]["author"] = prename + " " + surname;
  }
  return basisdokumentObject;
}

export function openEditFile(jsonStringBasisdokument: string, jsonStringEditFile: string, newVersionMode: IStateUserInput["newVersionMode"]) {
  let basisdokumentObject: any = JSON.parse(jsonStringBasisdokument);
  let editFileObject: any = JSON.parse(jsonStringEditFile);

  if (newVersionMode) {
    editFileObject["currentVersion"] = basisdokumentObject["currentVersion"] += 1;
  } else {
    editFileObject["currentVersion"] = basisdokumentObject["currentVersion"];
  }

  if (basisdokumentObject["currentVersion"] !== editFileObject["currentVersion"]) {
    editFileObject = updateSortingsIfVersionIsDifferent(basisdokumentObject, editFileObject);
  }

  return editFileObject;
}
