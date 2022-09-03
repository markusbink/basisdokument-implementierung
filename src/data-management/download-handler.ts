import { saveAs } from "file-saver";
import {
  IBookmark,
  IEntry,
  IHighlightedEntry,
  IHighlighter,
  IHint,
  ILitigiousCheck,
  IMetaData,
  INote,
  ISection,
  IVersion,
} from "../types";
import { jsPDF } from "jspdf";

function downloadObjectAsJSON(obj: object, fileName: string) {
  // Create a blob of the data
  var fileToSave = new Blob([JSON.stringify(obj)], {
    type: "application/json",
  });

  // Save the file
  saveAs(fileToSave, fileName);
}

function downloadBasisdokumentAsPDF(obj: any, fileName: string) {
  let pdfConverter = jsPDF,
    doc = new pdfConverter();

  let basisdokumentDOMRepresentation = document.createElement("div");
  basisdokumentDOMRepresentation.style.padding = "10px";
  basisdokumentDOMRepresentation.style.display = "flex";
  basisdokumentDOMRepresentation.style.flexDirection = "column";
  basisdokumentDOMRepresentation.style.width = "210px";

  // Main Title "Basisdokument"
  let mainTitleEl = document.createElement("h1");
  mainTitleEl.style.fontSize = "3px";
  mainTitleEl.style.fontWeight = "bold";
  mainTitleEl.innerHTML = "Basisdokument";
  basisdokumentDOMRepresentation.appendChild(mainTitleEl);

  // Case Id
  let caseIdEl = document.createElement("span");
  caseIdEl.innerHTML = "Aktenzeichen " + obj["caseId"];
  caseIdEl.style.fontSize = "3px";
  basisdokumentDOMRepresentation.appendChild(caseIdEl);

  // Version
  let versionEl = document.createElement("span");
  versionEl.innerHTML = "Version " + obj["currentVersion"];
  versionEl.style.fontSize = "3px";
  basisdokumentDOMRepresentation.appendChild(versionEl);

  // Export Timestamp
  let timestampEl = document.createElement("span");
  timestampEl.innerHTML =
    "Exportiert am " +
    obj["versions"][obj["versions"].length - 1]["timestamp"].toLocaleString();
  timestampEl.style.fontSize = "3px";
  basisdokumentDOMRepresentation.appendChild(timestampEl);

  // Hinweise des Richters nach
  let hintsTitleEl = document.createElement("span");
  hintsTitleEl.innerHTML = "Hinweise des Richters nach (nach §139 ZPO)";
  hintsTitleEl.style.fontSize = "4px";
  hintsTitleEl.style.marginTop = "4px";
  basisdokumentDOMRepresentation.appendChild(hintsTitleEl);

  for (let index = 0; index < obj["judgeHints"].length; index++) {
    const judgeHintObject = obj["judgeHints"][index];
    let judgeHintTitleEl = document.createElement("span");
    let entryCode = obj["entries"].find((entry: any) => {
      return entry.id === judgeHintObject.associatedEntry;
    }).entryCode;

    judgeHintTitleEl.innerHTML =
      judgeHintObject.author +
      " | Verweis auf: " +
      entryCode +
      " | " +
      judgeHintObject.title;
    judgeHintTitleEl.style.fontSize = "3px";
    judgeHintTitleEl.style.fontWeight = "bold";
    judgeHintTitleEl.style.marginTop = "4px";
    let judgeHintTextEl = document.createElement("span");
    judgeHintTextEl.innerHTML = judgeHintObject.text;
    judgeHintTextEl.style.fontSize = "3px";
    basisdokumentDOMRepresentation.appendChild(judgeHintTitleEl);
    basisdokumentDOMRepresentation.appendChild(judgeHintTextEl);
  }

  console.log(basisdokumentDOMRepresentation.outerHTML);
  let stringHtml = basisdokumentDOMRepresentation.outerHTML;

  doc.html(stringHtml).then(() => doc.save(fileName));
  //doc.save(fileName);
  //window.open(doc.output("bloburl"), "_blank");
}

export function downloadBasisdokument(
  caseId: string,
  currentVersion: number,
  versionHistory: IVersion[],
  metaData: IMetaData | null,
  entries: IEntry[],
  sectionList: ISection[],
  hints: IHint[],
  litigiousChecks: ILitigiousCheck[]
) {
  let basisdokumentObject: any = {};
  basisdokumentObject["caseId"] = caseId;
  basisdokumentObject["fileType"] = "basisdokument";
  basisdokumentObject["currentVersion"] = currentVersion;
  basisdokumentObject["versions"] = versionHistory;
  basisdokumentObject["versions"][basisdokumentObject["versions"].length - 1][
    "timestamp"
  ] = new Date() /*.toLocaleString("de-DE", {timeZone: "Europe/Berlin"})*/;
  basisdokumentObject["metaData"] = metaData;
  basisdokumentObject["entries"] = entries;
  basisdokumentObject["sections"] = sectionList;
  basisdokumentObject["judgeHints"] = hints;
  basisdokumentObject["litigiousChecks"] = litigiousChecks;
  // downloadObjectAsJSON(
  //   basisdokumentObject,
  //   "basisdokument_version_" + currentVersion + "_case_" + currentVersion
  // );
  downloadBasisdokumentAsPDF(
    basisdokumentObject,
    "basisdokument_version_" + currentVersion + "_case_" + currentVersion
  );
}

export function downloadEditFile(
  caseId: string,
  currentVersion: number,
  highlightedEntries: IHighlightedEntry[],
  colorSelection: IHighlighter[],
  notes: INote[],
  bookmarks: IBookmark[],
  individualSorting: string[]
) {
  let editFileObject: any = {};
  editFileObject["caseId"] = caseId;
  editFileObject["fileType"] = "editFile";
  editFileObject["currentVersion"] = currentVersion;
  editFileObject["highlightedEntries"] = highlightedEntries;
  editFileObject["highlighter"] = colorSelection;
  editFileObject["notes"] = notes;
  editFileObject["bookmarks"] = bookmarks;
  editFileObject["individualSorting"] = individualSorting;
  // downloadObjectAsJSON(
  //   editFileObject,
  //   "bearbeitungsdatei_version_" + currentVersion + "_case_" + currentVersion
  // );
}
