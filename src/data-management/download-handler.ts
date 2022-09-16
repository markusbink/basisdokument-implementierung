import { saveAs } from "file-saver";
import {
  IBookmark,
  IEntry,
  IHighlightedEntry,
  IHighlighter,
  IHint,
  IMetaData,
  IndividualEntrySortingEntry,
  INote,
  ISection,
  IVersion,
} from "../types";
import { jsPDF } from "jspdf";
import { groupEntriesBySectionAndParent } from "../contexts/CaseContext";
import { manropeMedium, manropeBold } from "../fonts/fonts";
import { format } from "date-fns";

function downloadObjectAsJSON(obj: object, fileName: string) {
  // Create a blob of the data
  var fileToSave = new Blob([JSON.stringify(obj)], {
    type: "application/json",
  });

  // Save the file
  saveAs(fileToSave, fileName + ".json");
}

function resetFontSize(parentElement: any) {
  ["p", "span", "div", "b", "i"].forEach((elementIType) => {
    parentElement.querySelectorAll(elementIType).forEach((element: any) => {
      element.style.fontSize = "3px";
    });
  });
  return parentElement;
}

function getEntryTimestamp(childEntry: any, obj: any) {
  let childEntryVersion = childEntry.version;
  let timestamp = format(
    new Date(obj["versions"][childEntryVersion - 1].timestamp),
    "dd.MM.yyyy"
  );
  return timestamp;
}

function addEntryToSection(
  groupedEntries: any,
  obj: any,
  entry: any,
  basisdokumentDOMRepresentation: any,
  i: number
) {
  if (groupedEntries[obj["sections"][i].id][entry.id]) {
    for (
      let childEntryIndex = 0;
      childEntryIndex < groupedEntries[obj["sections"][i].id][entry.id].length;
      childEntryIndex++
    ) {
      let childEntry =
        groupedEntries[obj["sections"][i].id][entry.id][childEntryIndex];

      let childEntryTitleEl = document.createElement("span");

      childEntryTitleEl.innerHTML =
        childEntry.entryCode +
        " | " +
        "Antwort auf: " +
        entry.entryCode +
        " | Autor: " +
        childEntry.author +
        " | Hinzugefügt am: " +
        getEntryTimestamp(childEntry, obj) +
        " | " +
        childEntry.role;
      childEntryTitleEl.style.fontSize = "3px";
      childEntryTitleEl.style.fontWeight = "bold";
      childEntryTitleEl.style.marginTop = "4px";
      basisdokumentDOMRepresentation.appendChild(childEntryTitleEl);

      let childEntryTextEl = document.createElement("span");
      childEntryTextEl.innerHTML = childEntry.text.trim();
      childEntryTextEl = resetFontSize(childEntryTextEl);
      childEntryTextEl.style.fontSize = "3px";
      childEntryTextEl.style.marginLeft = "4px";
      basisdokumentDOMRepresentation.appendChild(childEntryTextEl);
      addEntryToSection(
        groupedEntries,
        obj,
        childEntry,
        basisdokumentDOMRepresentation,
        i
      );
    }
  }
}

function downloadBasisdokumentAsPDF(obj: any, fileName: string) {
  let pdfConverter = jsPDF,
    doc = new pdfConverter();

  // converter https://www.giftofspeed.com/base64-encoder/

  doc.addFileToVFS("Manrope-Medium.ttf", manropeMedium);
  doc.addFileToVFS("Manrope-Bold.ttf", manropeBold);
  doc.addFont("Manrope-Medium.ttf", "Manrope", "normal");
  doc.addFont("Manrope-Bold.ttf", "Manrope", "bold");
  doc.setFontSize(4);
  doc.setFont("Manrope");

  let basisdokumentDOMRepresentation = document.createElement("div");
  basisdokumentDOMRepresentation.style.display = "flex";
  basisdokumentDOMRepresentation.style.flexDirection = "column";
  basisdokumentDOMRepresentation.style.width = "180px";

  // Main Title "Basisdokument"
  let mainTitleEl = document.createElement("h1");
  mainTitleEl.style.fontSize = "5px";
  mainTitleEl.style.fontWeight = "bold";
  mainTitleEl.innerHTML = "Basisdokument";
  basisdokumentDOMRepresentation.appendChild(mainTitleEl);

  // Case Id
  let caseIdEl = document.createElement("span");
  caseIdEl.innerHTML = "Aktenzeichen: " + obj["caseId"];
  caseIdEl.style.fontSize = "3px";
  basisdokumentDOMRepresentation.appendChild(caseIdEl);

  // Version
  let versionEl = document.createElement("span");
  versionEl.innerHTML = "Version: " + obj["currentVersion"];
  versionEl.style.fontSize = "3px";
  basisdokumentDOMRepresentation.appendChild(versionEl);

  // Export Timestamp
  let timestampEl = document.createElement("span");
  timestampEl.innerHTML =
    "Export: " +
    obj["versions"][obj["versions"].length - 1]["timestamp"].toLocaleString();
  timestampEl.style.fontSize = "3px";
  basisdokumentDOMRepresentation.appendChild(timestampEl);

  // Metadaten Plaintiff
  let metaPlaintiffTitleEl = document.createElement("span");
  metaPlaintiffTitleEl.innerHTML = "Metadaten Klagepartei";
  metaPlaintiffTitleEl.style.fontSize = "4px";
  metaPlaintiffTitleEl.style.fontWeight = "bold";
  metaPlaintiffTitleEl.style.marginTop = "4px";
  basisdokumentDOMRepresentation.appendChild(metaPlaintiffTitleEl);
  let metaPlaintiffTextEl = document.createElement("span");
  if (obj["metaData"]) {
    metaPlaintiffTextEl.innerHTML = obj["metaData"]["plaintiff"];
  } else {
    let noMetaDataTextEl = document.createElement("span");
    noMetaDataTextEl.innerHTML =
      "Es wurden keine Metadaten von der Klagepartei angelegt.";
    noMetaDataTextEl.style.fontSize = "3px";
    basisdokumentDOMRepresentation.appendChild(noMetaDataTextEl);
  }
  metaPlaintiffTextEl.style.fontSize = "3px";
  basisdokumentDOMRepresentation.appendChild(metaPlaintiffTextEl);

  // Metadaten Defendant
  let metaDefendantTitleEl = document.createElement("span");
  metaDefendantTitleEl.innerHTML = "Metadaten Beklagtenpartei";
  metaDefendantTitleEl.style.fontSize = "4px";
  metaDefendantTitleEl.style.fontWeight = "bold";
  metaDefendantTitleEl.style.marginTop = "4px";
  basisdokumentDOMRepresentation.appendChild(metaDefendantTitleEl);
  let metaDefendantTextEl = document.createElement("span");
  if (obj["metaData"]) {
    metaDefendantTextEl.innerHTML = obj["metaData"]["defendant"];
  } else {
    let noMetaDataTextEl = document.createElement("span");
    noMetaDataTextEl.innerHTML =
      "Es wurden keine Metadaten von der Beklagtenpartei angelegt.";
    noMetaDataTextEl.style.fontSize = "3px";
    basisdokumentDOMRepresentation.appendChild(noMetaDataTextEl);
  }
  metaDefendantTextEl.style.fontSize = "3px";
  basisdokumentDOMRepresentation.appendChild(metaDefendantTextEl);

  // hints from the judge §139 ZPO
  let hintsTitleEl = document.createElement("span");
  hintsTitleEl.innerHTML = "Hinweise des Richters nach (nach §139 ZPO)";
  hintsTitleEl.style.fontSize = "4px";
  hintsTitleEl.style.fontWeight = "bold";
  hintsTitleEl.style.marginTop = "3px";
  basisdokumentDOMRepresentation.appendChild(hintsTitleEl);

  if (obj["judgeHints"].length === 0) {
    let noHintTextEl = document.createElement("span");
    noHintTextEl.innerHTML =
      "Es wurden keine Hinweise von der Richterin / dem Richter verfasst.";
    noHintTextEl.style.fontSize = "3px";
    basisdokumentDOMRepresentation.appendChild(noHintTextEl);
  }

  for (let index = 0; index < obj["judgeHints"].length; index++) {
    const judgeHintObject = obj["judgeHints"][index];
    let judgeHintTitleEl = document.createElement("span");
    let filteredEntry = obj["entries"].find((entry: any) => {
      return entry.id === judgeHintObject.associatedEntry;
    });
    let entryCodeText;
    if (filteredEntry) {
      let entryCode = filteredEntry.entryCode;
      entryCodeText = " | Verweis auf: " + entryCode;
    } else {
      entryCodeText = "";
    }

    judgeHintTitleEl.innerHTML =
      judgeHintObject.author + entryCodeText + " | " + judgeHintObject.title;
    judgeHintTitleEl.style.fontSize = "3px";
    judgeHintTitleEl.style.fontWeight = "bold";
    judgeHintTitleEl.style.marginTop = "3px";
    let judgeHintTextEl = document.createElement("span");
    judgeHintTextEl.innerHTML = judgeHintObject.text;
    judgeHintTextEl.style.fontSize = "3px";
    basisdokumentDOMRepresentation.appendChild(judgeHintTitleEl);
    basisdokumentDOMRepresentation.appendChild(judgeHintTextEl);
  }

  // discussion Title
  let discussionTitleEl = document.createElement("span");
  discussionTitleEl.innerHTML = "Parteivortrag";
  discussionTitleEl.style.fontSize = "4px";
  discussionTitleEl.style.fontWeight = "bold";
  discussionTitleEl.style.marginTop = "3px";
  basisdokumentDOMRepresentation.appendChild(discussionTitleEl);

  // Get grouped entries
  let groupedEntries = groupEntriesBySectionAndParent(obj["entries"]);

  if (obj["sections"].length === 0) {
    let noEntryTextEl = document.createElement("span");
    noEntryTextEl.innerHTML =
      "Es wurden keine Gliederungspunkte / Beiträge von den Parteien angelegt.";
    noEntryTextEl.style.fontSize = "3px";
    basisdokumentDOMRepresentation.appendChild(noEntryTextEl);
  }

  for (let i = 0; i < obj["sections"].length; i++) {
    // section index
    let letSectionTitleEl = document.createElement("span");
    letSectionTitleEl.innerHTML = `${i + 1}. Gliederungspunkt`;
    letSectionTitleEl.style.fontSize = "3.5px";
    letSectionTitleEl.style.fontWeight = "bold";
    letSectionTitleEl.style.marginTop = "3px";
    basisdokumentDOMRepresentation.appendChild(letSectionTitleEl);

    // section title plaintiff
    let letSectionTitlePlaintiffEl = document.createElement("span");
    letSectionTitlePlaintiffEl.innerHTML =
      "Titel Klagepartei: " + obj["sections"][i].titlePlaintiff;
    letSectionTitlePlaintiffEl.style.fontSize = "3px";
    letSectionTitlePlaintiffEl.style.color = "gray";
    basisdokumentDOMRepresentation.appendChild(letSectionTitlePlaintiffEl);

    // section title defendant
    let letSectionTitleDefendantEl = document.createElement("span");
    letSectionTitleDefendantEl.innerHTML =
      "Titel Beklagtenpartei: " + obj["sections"][i].titleDefendant;
    letSectionTitleDefendantEl.style.fontSize = "3px";
    letSectionTitleDefendantEl.style.color = "gray";
    basisdokumentDOMRepresentation.appendChild(letSectionTitleDefendantEl);

    // get section entries
    if (groupedEntries[obj["sections"][i].id]) {
      let sectionEntriesParent = groupedEntries[obj["sections"][i].id].parent;
      for (let entryId = 0; entryId < sectionEntriesParent.length; entryId++) {
        const entry = sectionEntriesParent[entryId];

        let entryTitleEl = document.createElement("span");
        entryTitleEl.innerHTML =
          entry.entryCode + " | " + entry.author + " | " + entry.role;
        entryTitleEl.style.fontSize = "3px";
        entryTitleEl.style.fontWeight = "bold";
        entryTitleEl.style.marginTop = "4px";
        basisdokumentDOMRepresentation.appendChild(entryTitleEl);

        let entryTextEl = document.createElement("div");
        entryTextEl.innerHTML = entry.text.trim();
        entryTextEl = resetFontSize(entryTextEl);

        entryTextEl.style.fontSize = "3px";
        basisdokumentDOMRepresentation.appendChild(entryTextEl);

        addEntryToSection(
          groupedEntries,
          obj,
          entry,
          basisdokumentDOMRepresentation,
          i
        );
      }
    } else {
      let noEntryInSectionTextEl = document.createElement("span");
      noEntryInSectionTextEl.innerHTML =
        "Es wurden keine Beiträge zu diesem Gliederungspunkt verfasst.";
      noEntryInSectionTextEl.style.fontSize = "3px";
      basisdokumentDOMRepresentation.appendChild(noEntryInSectionTextEl);
    }
  }

  // Remove default margins
  let allParagraphs = basisdokumentDOMRepresentation.querySelectorAll("p");
  for (let index = 0; index < allParagraphs.length; index++) {
    const element = allParagraphs[index];
    element.style.minHeight = "1px";
    element.style.marginBottom = "1px";
  }

  let allLists = basisdokumentDOMRepresentation.querySelectorAll("ul");
  for (let index = 0; index < allLists.length; index++) {
    const element = allLists[index];
    element.style.margin = "1px";
    element.style.marginLeft = "4px";
  }
  let allNumberedLists = basisdokumentDOMRepresentation.querySelectorAll("ol");
  for (let index = 0; index < allNumberedLists.length; index++) {
    const element = allNumberedLists[index];
    element.style.margin = "1px";
    element.style.marginLeft = "4px";
  }

  let allListItems = basisdokumentDOMRepresentation.querySelectorAll("li");
  for (let index = 0; index < allListItems.length; index++) {
    const element = allListItems[index];
    element.style.margin = "0px";
  }

  let allStrongItems =
    basisdokumentDOMRepresentation.querySelectorAll("strong");
  for (let index = 0; index < allStrongItems.length; index++) {
    const element = allStrongItems[index];
    element.style.marginBottom = "0px";
  }

  let allBoldItems =
    basisdokumentDOMRepresentation.querySelectorAll("b");
  for (let index = 0; index < allBoldItems.length; index++) {
    const element = allBoldItems[index];
    element.style.marginBottom = "0px";
  }

  let allItalicItems = basisdokumentDOMRepresentation.querySelectorAll("i");
  for (let index = 0; index < allItalicItems.length; index++) {
    const element = allItalicItems[index];
    element.style.marginBottom = "0px";
  }

  let stringHtml = basisdokumentDOMRepresentation.outerHTML;

  doc
    .html(stringHtml, {
      autoPaging: "text",
      margin: 15,
    })
    .then(() => {
      doc.addPage();
      doc.setFontSize(8);
      doc.text(
        ".................................................................................................................................",
        10,
        60
      );
      doc.text("Vorname, Nachname", 10, 64);
      doc.text(
        ".................................................................................................................................",
        10,
        90
      );
      doc.text("Ort, Datum", 10, 94);
      doc.text(
        "...........................................................................",
        10,
        120
      );
      doc.text("Unterschrift", 10, 124);
      doc.save(fileName);
    });
}

export function downloadBasisdokument(
  caseId: string,
  currentVersion: number,
  versionHistory: IVersion[],
  metaData: IMetaData | null,
  entries: IEntry[],
  sectionList: ISection[],
  hints: IHint[]
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
  downloadObjectAsJSON(
    basisdokumentObject,
    "basisdokument_version_" + currentVersion + "_az_" + caseId
  );
  downloadBasisdokumentAsPDF(
    basisdokumentObject,
    "basisdokument_version_" + currentVersion + "_az_" + caseId
  );
}

export function downloadEditFile(
  caseId: string,
  currentVersion: number,
  highlightedEntries: IHighlightedEntry[],
  colorSelection: IHighlighter[],
  notes: INote[],
  bookmarks: IBookmark[],
  individualSorting: string[],
  individualEntrySorting: { [key: string]: IndividualEntrySortingEntry[] }
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
  editFileObject["individualEntrySorting"] = individualEntrySorting;
  downloadObjectAsJSON(
    editFileObject,
    "bearbeitungsdatei_version_" + currentVersion + "_az_" + caseId
  );
}
