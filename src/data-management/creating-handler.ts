import { IStateUserInput } from "../types";

export function createBasisdokument(prename: IStateUserInput["prename"], surname: IStateUserInput["surname"], role: IStateUserInput["role"], caseId: IStateUserInput["caseId"]) {
  var basisdokumentObject: any = {};
  basisdokumentObject["caseId"] = caseId;
  basisdokumentObject["currentVersion"] = 1;
  basisdokumentObject["versions"] = [];
  basisdokumentObject["versions"].push({ author: prename + " " + surname, role: role, timestamp: "" });
  basisdokumentObject["metadata"] = { plaintiff: "", defendant: "" };
  basisdokumentObject["entries"] = [];
  basisdokumentObject["sections"] = [];
  basisdokumentObject["judgeHints"] = [];
  basisdokumentObject["litigiousChecks"] = [];
  return basisdokumentObject;
}

export function createEditFile(prename: IStateUserInput["prename"], surname: IStateUserInput["surname"], role: IStateUserInput["role"], caseId: IStateUserInput["caseId"]) {
  var editFileObject: any = {};
  editFileObject["caseId"] = caseId;
  editFileObject["currentVersion"] = 1;
  editFileObject["highlightedEntries"] = [];
  editFileObject["highlighter"] = [];
  editFileObject["notes"] = [];
  editFileObject["bookmarks"] = [];
  editFileObject["individualSorting"] = [];
  return editFileObject;
}
