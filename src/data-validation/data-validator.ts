import { IStateUserInput } from "../types";

function updateVersion(object: any) {
  object["currentVersion"] = object["currentVersion"] += 1;
  return object;
}

function addVersionToVersionHistory(object: any, prename: IStateUserInput["prename"], surname: IStateUserInput["surname"], party: IStateUserInput["party"]) {
  return object.push({ author: prename + " " + surname, role: party, timestamp: "" });
}

function updateSortingsIfVersionIsDifferent(basisdokumentObject: any, editFileObject: any) {
  console.log("sections bd file", basisdokumentObject["sections"]);
  console.log("sections edit file", editFileObject["individualSorting"]);

  // we need to delete sections from the edit file that are not in the uploaded basisdokument
  var sortingsOriginalOrderFromBasisdokumentFile = new Set();
  var sortingsFromEditFile = new Set();

  for (const i in editFileObject["individualSorting"]) {
    sortingsOriginalOrderFromBasisdokumentFile.add(editFileObject["individualSorting"][i]);
  }

  for (const i in basisdokumentObject["sections"]) {
    sortingsFromEditFile.add(basisdokumentObject["sections"][i].id);
  }

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

export function loadBearbeitungsdatei(
  jsonStringBasisdokument: string,
  jsonStringBearbeitungdatei: string,
  newVersionMode: IStateUserInput["newVersionMode"],
  prename: IStateUserInput["prename"],
  surname: IStateUserInput["surname"],
  party: IStateUserInput["party"]
) {
  let basisdokumentObject: any = JSON.parse(jsonStringBasisdokument);
  let editFileObject: any = JSON.parse(jsonStringBearbeitungdatei);
  if (newVersionMode) {
    editFileObject = updateVersion(editFileObject);
  }

  if (basisdokumentObject["currentVersion"] !== editFileObject["currentVersion"]) {
    editFileObject = updateSortingsIfVersionIsDifferent(basisdokumentObject, editFileObject);
  }

  return editFileObject;
}
