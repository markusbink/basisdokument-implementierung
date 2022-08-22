import { IStateUserInput } from "../types";

function updateVersion(object: any) {
  object["currentVersion"] = object["currentVersion"] += 1;
  return object;
}

function addVersionToVersionHistory(object: any, prename: IStateUserInput["prename"], surname: IStateUserInput["surname"], party: IStateUserInput["party"]) {
  return object.push({ author: prename + " " + surname, role: party, timestamp: "" });
}

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

export function loadBasisdokument(
  jsonStringBasisdokument: string,
  newVersionMode: IStateUserInput["newVersionMode"],
  prename: IStateUserInput["prename"],
  surname: IStateUserInput["surname"],
  party: IStateUserInput["party"]
) {
  let basisdokumentObject: any = JSON.parse(jsonStringBasisdokument);
  if (newVersionMode) {
    basisdokumentObject = updateVersion(basisdokumentObject);
    basisdokumentObject = addVersionToVersionHistory(basisdokumentObject, prename, surname, party);
  }
  return basisdokumentObject;
}

export function loadEditFile(
  jsonStringBasisdokument: string,
  jsonStringEditFile: string,
  newVersionMode: IStateUserInput["newVersionMode"],
) {
  let basisdokumentObject: any = JSON.parse(jsonStringBasisdokument);
  let editFileObject: any = JSON.parse(jsonStringEditFile);
  if (newVersionMode) {
    editFileObject = updateVersion(editFileObject);
  }

  if (basisdokumentObject["currentVersion"] !== editFileObject["currentVersion"]) {
    editFileObject = updateSortingsIfVersionIsDifferent(basisdokumentObject, editFileObject);
  }

  return editFileObject;
}


export function createNewBasisdokument(prename: IStateUserInput["prename"], surname:IStateUserInput["surname"], party: IStateUserInput["party"]) {

}

export function createEditFile(prename: IStateUserInput["prename"], surname:IStateUserInput["surname"], party: IStateUserInput["party"]) {

}