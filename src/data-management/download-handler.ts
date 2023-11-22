import { saveAs } from "file-saver";
import {
  IBookmark,
  IEntry,
  IEvidence,
  IHighlightedEntry,
  IHighlighter,
  IHint,
  IMetaData,
  IndividualEntrySortingEntry,
  INote,
  ISection,
  IVersion,
  UserRole,
} from "../types";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { groupEntriesBySectionAndParent } from "../contexts/CaseContext";
import { format } from "date-fns";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { getEvidences } from "../util/get-evidences";

//define data arrays
let allEntries: any[] = [];
let newEntries: any[] = [];
let rubrumKlage: any[] = [];
let rubrumBeklagt: any[] = [];
let basisdokument: any[] = [];
let allHints: any[] = [];
let klageEvidences: any[] = [];
let beklagtEvidences: any[] = [];

function downloadObjectAsJSON(obj: object, fileName: string) {
  // Create a blob of the data
  const fileToSave = new Blob([JSON.stringify(obj)], {
    type: "application/json",
  });

  // Save the file
  saveAs(fileToSave, fileName + ".txt");
}

function downloadAdditionalFiles(evidences: IEvidence[]) {
  const zip = new JSZip();
  const plaintiffFolder = zip.folder("Anlagen Klagepartei");
  const defendantFolder = zip.folder("Anlagen Beklagtenpartei");

  if (evidences) {
    for (let i = 0; i < evidences?.length; i++) {
      if (evidences[i].hasImageFile) {
        if (evidences[i].role === "Klagepartei") {
          plaintiffFolder?.file(
            evidences[i].attachmentId +
              "_" +
              cleanFileName(evidences[i].name) +
              "_" +
              cleanFileName(evidences[i].imageFilename!),
            dataURItoBlob(evidences[i].imageFile),
            { binary: true, compression: "DEFLATE" }
          );
        } else {
          defendantFolder?.file(
            evidences[i].attachmentId +
              "_" +
              cleanFileName(evidences[i].name) +
              "_" +
              cleanFileName(evidences[i].imageFilename!),
            dataURItoBlob(evidences[i].imageFile),
            { binary: true, compression: "DEFLATE" }
          );
        }
      }
    }
  }
  // only download combined zip-folder if one of the two folders is not empty
  if (
    countZipFiles(zip.folder("Anlagen Klagepartei")) ||
    countZipFiles(zip.folder("Anlagen Beklagtenpartei"))
  ) {
    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, "Anlagen.zip");
    });
  }
}

// clean all illegal characters in filenames
function cleanFileName(name: string) {
  return name.replace(/[/\\?%*:|"<>]/g, "");
}

function countZipFiles(zipFolder: any) {
  let countFiles = 0;
  zipFolder.forEach(function () {
    countFiles++;
  });
  if (countFiles > 0) {
    return true;
  } else {
    return false;
  }
}

//source: https://stackoverflow.com/questions/46405773/saving-base64-image-with-filesaver-js
function dataURItoBlob(dataURI: any) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], { type: mimeString });
  return blob;
}

function downloadPDF(PDF: any, fileName: string) {
  const fileToSave = new Blob([PDF], {
    type: "application/pdf",
  });

  saveAs(fileToSave, fileName + ".pdf");
}

function getEntryTimestamp(childEntry: any, obj: any) {
  let childEntryVersion = childEntry.version;
  let timestamp = format(
    new Date(obj["versions"][childEntryVersion - 1].timestamp),
    "dd.MM.yyyy"
  );
  return timestamp;
}

//get associated entry title
function getEntryTitle(entryId: any, obj: any) {
  if (entryId) {
    let title;
    for (var i = 0; i < obj["entries"].length; i++) {
      if (obj["entries"][i].id === entryId) {
        title =
          obj["entries"][i].entryCode + " | Autor: " + obj["entries"][i].author;
      }
    }
    return "Antwort auf: " + title;
  } else {
    return;
  }
}

//add evidences in one string because of autotable commas
function getEvidenceNumeration(
  evidenceList: IEvidence[],
  evidenceIds: Array<string>
) {
  var numEvidences: string = "";
  if (evidenceIds) {
    let evidences = getEvidences(evidenceList, evidenceIds);
    if (evidences.length === 1) {
      let evidence = evidences[0].name;
      if (evidences[0].hasAttachment) {
        evidence = evidence + " als Anlage " + evidences[0].attachmentId;
      }
      if (evidences[0].hasImageFile) {
        evidence = evidence + ": " + evidences[0].imageFilename;
      }
      numEvidences = numEvidences + evidence;
    } else {
      for (let i = 0; i < evidences.length; i++) {
        let evidence = i + 1 + ") " + evidences[i].name;
        if (evidences[i].hasAttachment) {
          evidence = evidence + " als Anlage " + evidences[i].attachmentId;
        }
        if (evidences[i].hasImageFile) {
          evidence = evidence + ": " + evidences[i].imageFilename;
        }
        //do not add line break/empty line to last item
        if (i === evidences.length - 1) {
          numEvidences = numEvidences + evidence;
        } else {
          numEvidences = numEvidences + evidence + "\n";
        }
      }
    }
    return numEvidences;
  }
}

//parse HTML to string to remove tags
function parseHTMLtoString(htmltext: any) {
  const parser = new DOMParser();
  const parserElem = parser.parseFromString(htmltext, "text/html");
  //add enumeration in ordered lists
  var orderedLists = parserElem.getElementsByTagName("ol");
  for (let i = 0; i < orderedLists.length; i++) {
    let listitems = orderedLists[i].getElementsByTagName("li");
    for (let j = 0; j < listitems.length; j++) {
      if (j === 0) {
        listitems[j].innerText = "\n" + (j + 1) + ". " + listitems[j].innerText;
      } else if (j === listitems.length - 1) {
        listitems[j].innerText = j + 1 + ". " + listitems[j].innerText + "\n";
      } else {
        listitems[j].innerText = j + 1 + ". " + listitems[j].innerText;
      }
    }
  }
  //add bulletpoints in unordered lists
  var unorderedLists = parserElem.getElementsByTagName("ul");
  for (let i = 0; i < unorderedLists.length; i++) {
    let bulletpoints = unorderedLists[i].getElementsByTagName("li");
    for (let j = 0; j < bulletpoints.length; j++) {
      if (j === 0) {
        bulletpoints[j].innerText = "\n• " + bulletpoints[j].innerText;
      } else if (j === bulletpoints.length - 1) {
        bulletpoints[j].innerText = "• " + bulletpoints[j].innerText + "\n";
      } else {
        bulletpoints[j].innerText = "• " + bulletpoints[j].innerText;
      }
    }
  }
  //add newline for spacing
  let parsedtext = "\n" + parserElem.body.innerText;
  return parsedtext
    .replace(/[^\S\n]/g, " ") //remove all NNBSPs -> formatting error
    .replace(/\u00A0/g, "\n") //change all NBSPs to newlines for spacing
    .replace(/^\n\n+|\n\n+$/g, "\n"); //format more than one newline at the beginning or end of string to one
}

//get role profession, e.g. "Rechtsanwältin/Rechtsanwalt" for plaintiff or defendant
//readonly cannot download pdf
function getRoleProfession(role: string) {
  if (role === "Richter:in") {
    return "Richterin/Richter";
  } else {
    return "Rechtsanwältin/Rechtsanwalt";
  }
}

async function mergePDF(
  coverPDF: ArrayBuffer,
  basisdokumentPDF: ArrayBuffer,
  fileName: string
) {
  let pdfDoc = await PDFDocument.create();

  const cover = await PDFDocument.load(coverPDF);
  const other = await PDFDocument.load(basisdokumentPDF);

  var page;
  var coverPages = await pdfDoc.embedPages(cover.getPages());
  var otherPages = await pdfDoc.embedPages(other.getPages());

  for (var coverPage of coverPages) {
    page = pdfDoc.addPage();
    page.drawPage(coverPage);
  }
  for (var basisdokumentPage of otherPages) {
    page = pdfDoc.addPage();
    page.drawPage(basisdokumentPage);
  }

  const pdfBytes = await pdfDoc.save();
  const file = new Blob([pdfBytes], { type: "application/pdf" });
  downloadPDF(file, fileName);
}

async function downloadBasisdokumentAsPDF(
  coverPDF: ArrayBuffer | undefined,
  downloadNew: boolean,
  downloadEvidences: boolean,
  evidenceList: IEvidence[],
  obj: any,
  fileName: string
) {
  let doc = new jsPDF();
  let newDoc = new jsPDF(); //additional pdf with only new entries
  let evDoc = new jsPDF(); //additional pdf with only evidences

  //DATA for autotables
  // basic data
  let basicData = {
    caseId: "Aktenzeichen: " + obj["caseId"],
    version: "Version: " + obj["currentVersion"],
    timestamp:
      "Export: " +
      obj["versions"][obj["versions"].length - 1]["timestamp"].toLocaleString(),
    regard: "Betreff: " + obj["regard"],
  };
  basisdokument.push(basicData);

  // Rubrum Plaintiff
  let metaPlaintiff;
  if (obj["metaData"] && obj["metaData"]["plaintiff"] !== undefined) {
    metaPlaintiff = obj["metaData"]["plaintiff"];
  } else {
    metaPlaintiff = "Es wurde kein Rubrum von der Klagepartei angelegt.";
  }
  rubrumKlage = [parseHTMLtoString(metaPlaintiff)];

  // Rubrum Defendant
  let metaDefendant;
  if (obj["metaData"] && obj["metaData"]["defendant"] !== undefined) {
    metaDefendant = obj["metaData"]["defendant"];
  } else {
    metaDefendant = "Es wurde kein Rubrum von der Beklagtenpartei angelegt.";
  }
  rubrumBeklagt = [parseHTMLtoString(metaDefendant)];

  // hints from the judge §139 ZPO
  if (obj["judgeHints"].length === 0) {
    //no hints
    allHints.push({
      title: "Keine Hinweise",
      text: "Es wurden bisher keine Hinweise von der Richterin / dem Richter verfasst.",
    });
  }

  for (let i = 0; i < obj["judgeHints"].length; i++) {
    const judgeHintObject = obj["judgeHints"][i];
    let filteredEntry = obj["entries"].find((entry: any) => {
      return entry.id === judgeHintObject.associatedEntry;
    });
    let entryId;
    let entryCodeText;
    if (filteredEntry) {
      let entryCode = filteredEntry.entryCode;
      entryId = entryCode;
      entryCodeText = " | Verweis auf: " + entryCode;
    } else {
      entryCodeText = "";
    }

    let hint = {
      id: entryId,
      title:
        judgeHintObject.author +
        entryCodeText +
        " | " +
        judgeHintObject.title +
        " | Hinzugefügt am: " +
        getEntryTimestamp(judgeHintObject, obj),
      text: parseHTMLtoString(judgeHintObject.text),
      version: judgeHintObject.version,
    };
    allHints.push(hint);
  }

  // Get grouped entries
  let groupedEntries = groupEntriesBySectionAndParent(obj["entries"]);

  if (obj["sections"].length === 0) {
    //no entries
    allEntries.push({
      id: "N",
      title: "Keine Beiträge",
      text: "Es wurden keine Gliederungspunkte / Beiträge von den Parteien angelegt.",
    });
  }

  for (let i = 0; i < obj["sections"].length; i++) {
    let titleEntry;
    titleEntry = {
      // section index
      section: `${i + 1}. Gliederungspunkt`,
      // section title plaintiff
      titlePlaintiff: "Titel Klagepartei: " + obj["sections"][i].titlePlaintiff,
      // section title defendant
      titleDefendant:
        "Titel Beklagtenpartei: " + obj["sections"][i].titleDefendant,
    };
    allEntries.push(titleEntry);

    // get section entries
    if (groupedEntries[obj["sections"][i].id]) {
      let sectionEntries = [];
      for (let j = 0; j < obj["entries"].length; j++) {
        if (obj["entries"][j].sectionId === obj["sections"][i].id) {
          sectionEntries.push(obj["entries"][j]);
        }
      }
      for (let j = 0; j < sectionEntries.length; j++) {
        const entry = sectionEntries[j];
        //all entries
        let tableEntry = {
          id: entry.entryCode,
          title:
            entry.entryCode +
            " | " +
            entry.author +
            " | " +
            entry.role +
            " | Hinzugefügt am: " +
            getEntryTimestamp(entry, obj),
          text: parseHTMLtoString(entry.text),
          version: entry.version,
          associatedEntry: getEntryTitle(entry.associatedEntry, obj),
          evidences: !entry.evidenceIds?.length
            ? undefined
            : entry.evidences?.length > 1
            ? !entry.caveatOfProof
              ? "Beweise:\n" +
                getEvidenceNumeration(obj["evidences"], entry.evidenceIds)
              : "Beweise unter Verwahrung gegen die Beweislast:\n" +
                getEvidenceNumeration(obj["evidences"], entry.evidenceIds)
            : !entry.caveatOfProof
            ? "Beweis:\n" +
              getEvidenceNumeration(obj["evidences"], entry.evidenceIds)
            : "Beweis unter Verwahrung gegen die Beweislast:\n" +
              getEvidenceNumeration(obj["evidences"], entry.evidenceIds),
        };
        allEntries.push(tableEntry);

        //new entries
        let newEntry;
        if (entry.version === obj["currentVersion"]) {
          newEntry = {
            id: entry.entryCode,
            title: entry.entryCode + " | " + entry.author + " | " + entry.role,
            text: parseHTMLtoString(entry.text),
            version: entry.version,
            associatedEntry: getEntryTitle(entry.associatedEntry, obj),
            evidences: !entry.evidenceIds?.length
              ? undefined
              : entry.evidences?.length > 1
              ? !entry.caveatOfProof
                ? "Beweise:\n" +
                  getEvidenceNumeration(obj["evidences"], entry.evidenceIds)
                : "Beweise unter Verwahrung gegen die Beweislast:\n" +
                  getEvidenceNumeration(obj["evidences"], entry.evidenceIds)
              : !entry.caveatOfProof
              ? "Beweis:\n" +
                getEvidenceNumeration(obj["evidences"], entry.evidenceIds)
              : "Beweis unter Verwahrung gegen die Beweislast:\n" +
                getEvidenceNumeration(obj["evidences"], entry.evidenceIds),
          };
          newEntries.push(newEntry);
        }
      }
    }
  }

  //get evidences of plaintiff and defendant
  let ev;
  for (let i = 0; i < evidenceList.length; i++) {
    if (evidenceList[i].hasImageFile) {
      ev = {
        designation: evidenceList[i].attachmentId + ": " + evidenceList[i].name,
        imageDesignation: evidenceList[i].imageFilename,
      };
    } else if (evidenceList[i].hasAttachment) {
      ev = {
        designation: evidenceList[i].attachmentId + ": " + evidenceList[i].name,
      };
    } else {
      ev = { designation: evidenceList[i].name };
    }
    if (evidenceList[i].role === UserRole.Plaintiff) {
      klageEvidences.push(ev);
    } else {
      beklagtEvidences.push(ev);
    }
  }

  // AUTOTABLES
  //autotable basisdokument metadata
  let basic;
  if (obj["regard"] === undefined) {
    basic = [
      [basisdokument[0].caseId],
      [basisdokument[0].version],
      [basisdokument[0].timestamp],
    ];
  } else {
    basic = [
      [basisdokument[0].caseId],
      [basisdokument[0].version],
      [basisdokument[0].timestamp],
      [basisdokument[0].regard],
    ];
  }
  autoTable(doc, {
    theme: "grid",
    styles: { fontStyle: "bold" },
    head: [["Basisdokument"]],
    headStyles: { fontStyle: "bold", fontSize: 14, fillColor: [0, 102, 204] },
    body: basic,
    didDrawPage: function () {
      doc.outline.add(null, "Basisdokument-Metadaten", {
        pageNumber: doc.getCurrentPageInfo().pageNumber,
      });
    },
  });
  //additional pdf with only new entries
  autoTable(newDoc, {
    theme: "grid",
    styles: { fontStyle: "bold" },
    head: [["Basisdokument - Neue Beiträge"]],
    headStyles: { fontStyle: "bold", fontSize: 14, fillColor: [0, 122, 122] },
    body: [
      [basisdokument[0].caseId],
      [basisdokument[0].version],
      [basisdokument[0].timestamp],
    ],
    didDrawPage: function () {
      newDoc.outline.add(null, "Basisdokument-Metadaten", {
        pageNumber: newDoc.getCurrentPageInfo().pageNumber,
      });
    },
  });
  //additional pdf with only evidences
  autoTable(evDoc, {
    theme: "grid",
    styles: { fontStyle: "bold" },
    head: [["Basisdokument - Beweisliste"]],
    headStyles: { fontStyle: "bold", fontSize: 14, fillColor: [0, 122, 122] },
    body: [
      [basisdokument[0].caseId],
      [basisdokument[0].version],
      [basisdokument[0].timestamp],
    ],
  });
  basisdokument = [];

  //autotable rubrum plaintiff
  autoTable(doc, {
    theme: "grid",
    styles: { halign: "center" },
    head: [["Rubrum Klagepartei"]],
    headStyles: { fillColor: [0, 102, 204] },
    body: [rubrumKlage],
    didDrawPage: function () {
      doc.outline.add(null, "Rubrum Klagepartei", {
        pageNumber: doc.getCurrentPageInfo().pageNumber,
      });
    },
  });
  //additional pdf with only new entries
  autoTable(newDoc, {
    theme: "grid",
    styles: { halign: "center" },
    head: [["Rubrum Klagepartei"]],
    headStyles: { fillColor: [0, 122, 122] },
    body: [rubrumKlage],
    didDrawPage: function () {
      newDoc.outline.add(null, "Rubrum Klagepartei", {
        pageNumber: newDoc.getCurrentPageInfo().pageNumber,
      });
    },
  });
  //additional pdf with only evidences
  autoTable(evDoc, {
    theme: "grid",
    styles: { halign: "center" },
    head: [["Rubrum Klagepartei"]],
    headStyles: { fillColor: [0, 122, 122] },
    body: [rubrumKlage],
  });
  rubrumKlage = [];

  //autotable rubrum defendant
  autoTable(doc, {
    theme: "grid",
    styles: { halign: "center" },
    head: [["Rubrum Beklagtenpartei"]],
    headStyles: { fillColor: [0, 102, 204] },
    body: [rubrumBeklagt],
    didDrawPage: function () {
      doc.outline.add(null, "Rubrum Beklagtenpartei", {
        pageNumber: doc.getCurrentPageInfo().pageNumber,
      });
    },
  });
  //additional pdf with only new entries
  autoTable(newDoc, {
    theme: "grid",
    styles: { halign: "center" },
    head: [["Rubrum Beklagtenpartei"]],
    headStyles: { fillColor: [0, 122, 122] },
    body: [rubrumBeklagt],
    didDrawPage: function () {
      newDoc.outline.add(null, "Rubrum Beklagtenpartei", {
        pageNumber: newDoc.getCurrentPageInfo().pageNumber,
      });
    },
  });
  //additional pdf with only evidences
  autoTable(evDoc, {
    theme: "grid",
    styles: { halign: "center" },
    head: [["Rubrum Beklagtenpartei"]],
    headStyles: { fillColor: [0, 122, 122] },
    body: [rubrumBeklagt],
  });
  rubrumBeklagt = [];

  //autotable hints
  doc.addPage();
  autoTable(doc, {
    theme: "grid",
    head: [["Hinweise des Richters (nach §139 ZPO)"]],
    headStyles: { fontStyle: "bold", fontSize: 12, fillColor: [0, 102, 204] },
    margin: { top: 6, bottom: 6, left: 6, right: 6 },
    didDrawPage: function () {
      doc.outline.add(null, "Hinweise des Richters (nach §139 ZPO)", {
        pageNumber: doc.getCurrentPageInfo().pageNumber,
      });
    },
  });
  for (let i = 0; i < allHints.length; i++) {
    let hintData = [[allHints[i].title], [allHints[i].text]];
    autoTable(doc, {
      theme: "grid",
      body: hintData,
      styles: {
        lineColor:
          allHints[i].version === obj["currentVersion"] ? [15, 82, 186] : 100,
        lineWidth: allHints[i].version === obj["currentVersion"] ? 0.6 : 0.3,
      },
      didParseCell: function (hookData) {
        if (hookData.row.index === 0) {
          hookData.cell.styles.fontStyle = "bold";
        }
      },
      willDrawCell: function (hookData) {
        if (hookData.cell.raw === "") {
          hookData.cell.styles.cellWidth = 0;
          hookData.cell.styles.cellPadding = 0;
        }
      },
    });
  }

  //autotable new entries
  if (newEntries.length !== 0) {
    //only show new entries page if there are new entries
    doc.addPage();
    autoTable(doc, {
      theme: "grid",
      head: [["Neue Beiträge"]],
      headStyles: {
        fontStyle: "bold",
        fontSize: 12,
        fillColor: [0, 102, 204],
        valign: "middle",
      },
      margin: { top: 7, bottom: 7, left: 7, right: 7 },
      didDrawPage: function () {
        doc.outline.add(null, "Neue Beiträge", {
          pageNumber: doc.getCurrentPageInfo().pageNumber,
        });
      },
    });
    for (let i = 0; i < newEntries.length; i++) {
      let data;
      if (newEntries[i].associatedEntry) {
        if (newEntries[i].evidences) {
          data = [
            ["Neuer Beitrag"],
            [newEntries[i].title],
            [newEntries[i].associatedEntry],
            [newEntries[i].text],
            [newEntries[i].evidences],
          ];
        } else {
          data = [
            ["Neuer Beitrag"],
            [newEntries[i].title],
            [newEntries[i].associatedEntry],
            [newEntries[i].text],
          ];
        }
      } else if (newEntries[i].evidences) {
        data = [
          ["Neuer Beitrag"],
          [newEntries[i].title],
          [newEntries[i].text],
          [newEntries[i].evidences],
        ];
      } else {
        data = [["Neuer Beitrag"], [newEntries[i].title], [newEntries[i].text]];
      }
      autoTable(doc, {
        theme: "grid",
        body: data,
        margin: {
          left: newEntries[i].id.includes("B") ? 30 : 10,
          right: newEntries[i].id.includes("B") ? 10 : 30,
          top: 7,
          bottom: 7,
        },
        didParseCell: function (hookData) {
          if (hookData.row.index === 0) {
            hookData.cell.styles.fontStyle = "italic";
          } else if (hookData.row.index === 1) {
            hookData.cell.styles.fontStyle = "bold";
          }
        },
        willDrawCell: function (hookData) {
          if (hookData.cell.raw === "") {
            hookData.cell.styles.cellWidth = 0;
            hookData.cell.styles.cellPadding = 0;
          }
        },
      });
    }
    //additional pdf with only new entries
    newDoc.addPage();
    autoTable(newDoc, {
      theme: "grid",
      head: [["Neue Beiträge"]],
      headStyles: {
        fontStyle: "bold",
        fontSize: 12,
        fillColor: [0, 122, 122],
        valign: "middle",
      },
      margin: { top: 7, bottom: 7, left: 7, right: 7 },
      didDrawPage: function () {
        newDoc.outline.add(null, "Neue Beiträge", {
          pageNumber: newDoc.getCurrentPageInfo().pageNumber,
        });
      },
    });
    for (let i = 0; i < newEntries.length; i++) {
      let data;
      if (newEntries[i].associatedEntry) {
        data = [
          ["Neuer Beitrag"],
          [newEntries[i].title],
          [newEntries[i].associatedEntry],
          [newEntries[i].text],
        ];
      } else {
        data = [["Neuer Beitrag"], [newEntries[i].title], [newEntries[i].text]];
      }
      autoTable(newDoc, {
        theme: "grid",
        body: data,
        margin: {
          left: newEntries[i].id.includes("B") ? 30 : 10,
          right: newEntries[i].id.includes("B") ? 10 : 30,
          top: 7,
          bottom: 7,
        },
        didParseCell: function (hookData) {
          if (hookData.row.index === 0) {
            hookData.cell.styles.fontStyle = "italic";
          } else if (hookData.row.index === 1) {
            hookData.cell.styles.fontStyle = "bold";
          }
        },
        willDrawCell: function (hookData) {
          if (hookData.cell.raw === "") {
            hookData.cell.styles.cellWidth = 0;
            hookData.cell.styles.cellPadding = 0;
          }
        },
      });
    }
    newEntries = [];
  }

  //autotable all entries
  doc.addPage();
  var node: any; //base node for sections outline
  autoTable(doc, {
    theme: "grid",
    margin: { top: 6, bottom: 6, left: 6, right: 6 },
    head: [["Parteivortrag"]],
    headStyles: { fontStyle: "bold", fontSize: 12, fillColor: [0, 102, 204] },
    didDrawPage: function () {
      node = doc.outline.add(null, "Parteivortrag", {
        pageNumber: doc.getCurrentPageInfo().pageNumber,
      });
    },
  });
  //const declaration needed for eslint no-loop-func warning
  const currEntriesNode = node;
  for (let i = 0; i < allEntries.length; i++) {
    if (allEntries[i].section) {
      autoTable(doc, {
        theme: "grid",
        head: [[allEntries[i].section]],
        headStyles: { fillColor: [0, 102, 204] },
        body: [[allEntries[i].titlePlaintiff], [allEntries[i].titleDefendant]],
        margin: { top: 7, bottom: 7, left: 7, right: 7 },
        didDrawPage: function (hookData) {
          doc.outline.add(
            currEntriesNode,
            ((((hookData.table.head[0].raw as unknown as string) + //section
              " | " +
              hookData.table.body[0].raw) as string) + //section title plaintiff
              " | " +
              hookData.table.body[1].raw) as string, //section title defendant
            { pageNumber: doc.getCurrentPageInfo().pageNumber }
          );
        },
      });
    } else {
      let data;
      if (allEntries[i].associatedEntry !== undefined) {
        if (allEntries[i].evidences !== undefined) {
          data = [
            [allEntries[i].title],
            [allEntries[i].associatedEntry],
            [allEntries[i].text],
            [allEntries[i].evidences],
          ];
        } else {
          data = [
            [allEntries[i].title],
            [allEntries[i].associatedEntry],
            [allEntries[i].text],
          ];
        }
      } else if (allEntries[i].evidences !== undefined) {
        data = [
          [allEntries[i].title],
          [allEntries[i].text],
          [allEntries[i].evidences],
        ];
      } else {
        data = [[allEntries[i].title], [allEntries[i].text]];
      }
      //const declarations needed for eslint no-loop-func warning
      const currEntryId = allEntries[i].id;
      const currAllHints = allHints;
      autoTable(doc, {
        theme: "grid",
        styles: {
          lineColor:
            allEntries[i].version === obj["currentVersion"]
              ? [15, 82, 186]
              : 100,
          lineWidth:
            allEntries[i].version === obj["currentVersion"] ? 0.6 : 0.3,
        },
        body: data,
        margin: {
          left: allEntries[i].id.includes("B") ? 30 : 10,
          right:
            allEntries[i].id.includes("B") || allEntries[i].id === "N"
              ? 10
              : 30,
          top: 7,
          bottom: 10,
        },
        didParseCell: function (hookData) {
          //TODO: try to format text
          if (hookData.row.index === 0) {
            hookData.cell.styles.fontStyle = "bold";
          }
        },
        willDrawCell: function (hookData) {
          if (hookData.cell.raw === "" || hookData.cell.raw === undefined) {
            hookData.cell.styles.cellWidth = 0;
            hookData.cell.styles.cellPadding = 0;
          }
        },
        didDrawCell: function (hookData) {
          let counterArr: any = [];
          for (let j = 0; j < currAllHints.length; j++) {
            if (
              currAllHints[j].id === currEntryId &&
              hookData.row.index === 0
            ) {
              if (currAllHints[j].id in counterArr) {
                counterArr[currAllHints[j].id] =
                  counterArr[currAllHints[j].id] + 2;
              } else {
                counterArr[currAllHints[j].id] = 0;
              }
              let xPos = hookData.cursor?.x as number;
              let yPos = hookData.cursor?.y as number;
              let offset = counterArr[currAllHints[j].id]; //offset for multiple hints to an entry
              doc.createAnnotation({
                type: "text",
                title: currAllHints[j].title,
                contents: currAllHints[j].text,
                bounds: {
                  x: currAllHints[j].id.includes("B")
                    ? xPos - 10 + offset
                    : xPos + hookData.cell.width + 2 + offset, //change position depending on defendant/plaintiff
                  y: yPos,
                  w: hookData.cell.contentWidth,
                  h: hookData.cell.contentHeight,
                },
                open: false,
              });
            }
          }
        },
      });
    }
  }
  allHints = [];
  allEntries = [];

  // additional evidences pdf

  autoTable(evDoc, {
    theme: "grid",
    head: [["Beweisliste Kläger"]],
    headStyles: { fillColor: [0, 122, 122] },
  });

  for (let i = 0; i < klageEvidences.length; i++) {
    let data;
    if (klageEvidences[i].imageDesignation) {
      data = [
        [klageEvidences[i].designation],
        [klageEvidences[i].imageDesignation],
      ];
    } else {
      data = [[klageEvidences[i].designation]];
    }
    autoTable(evDoc, {
      theme: "grid",
      body: data,
    });
  }
  klageEvidences = [];

  autoTable(evDoc, {
    theme: "grid",
    head: [["Beweisliste Beklagter"]],
    headStyles: { fillColor: [0, 122, 122] },
  });

  for (let i = 0; i < beklagtEvidences.length; i++) {
    let data;
    if (beklagtEvidences[i].imageDesignation) {
      data = [
        [beklagtEvidences[i].designation],
        [beklagtEvidences[i].imageDesignation],
      ];
    } else {
      data = [[beklagtEvidences[i].designation]];
    }
    autoTable(evDoc, {
      theme: "grid",
      body: data,
    });
  }
  beklagtEvidences = [];

  //signature page
  let signatureData: any = [
    [
      parseHTMLtoString(
        "Datum: " +
          obj["versions"][obj["versions"].length - 1]["timestamp"]
            .toLocaleString()
            .substring(0, 9) +
          "\n" +
          "\n" +
          "gez. " +
          "\n" +
          (obj["otherAuthor"] === undefined
            ? obj["versions"][obj["versions"].length - 1].author
            : obj["otherAuthor"])
      ) +
        "\n" +
        getRoleProfession(obj["versions"][obj["versions"].length - 1].role),
    ],
  ];
  autoTable(doc, {
    theme: "grid",
    styles: { fontSize: 11, cellPadding: 5 },
    body: signatureData,
  });

  //set pageframes + pagenumbers
  var pageCount = doc.getNumberOfPages();
  for (let i = 0; i < pageCount; i++) {
    doc.setPage(i);

    let pageWidth = doc.internal.pageSize.width;
    let pageHeight = doc.internal.pageSize.height;

    //pageframes
    doc.setLineWidth(0.1);
    doc.setDrawColor(229, 228, 226);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
    doc.stroke();

    //pagenumbers
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    let currentPageNum = doc.getCurrentPageInfo().pageNumber;
    let pageNumPos;
    //single digit pagenumber
    if (pageCount.toString().length === 1) {
      pageNumPos =
        currentPageNum.toString().length === 1
          ? pageWidth - 20
          : currentPageNum.toString().length === 2
          ? pageWidth - 22
          : pageWidth - 24;
      //double digit pagenumber
    } else if (pageCount.toString().length === 2) {
      pageNumPos =
        currentPageNum.toString().length === 1
          ? pageWidth - 22
          : currentPageNum.toString().length === 2
          ? pageWidth - 24
          : pageWidth - 26;
      //three and more digit pagenumber
    } else {
      pageNumPos =
        currentPageNum.toString().length === 1
          ? pageWidth - 24
          : currentPageNum.toString().length === 2
          ? pageWidth - 26
          : pageWidth - 28;
    }
    doc.text(
      "Seite " + currentPageNum + "/" + pageCount,
      pageNumPos,
      pageHeight - 7
    );
  }

  //save or merge basisdokument pdf
  if (coverPDF !== undefined) {
    const pdfBuffer = doc.output("arraybuffer");
    mergePDF(coverPDF, pdfBuffer, fileName);
  } else {
    doc.save(fileName);
  }
  if (downloadNew) {
    newDoc.save("neue_beitraege_" + fileName);
  }
  if (downloadEvidences) {
    evDoc.save("beweisliste_" + fileName);
  }
}

export function downloadBasisdokument(
  fileId: string,
  caseId: string,
  currentVersion: number,
  versionHistory: IVersion[],
  metaData: IMetaData | null,
  entries: IEntry[],
  sectionList: ISection[],
  evidenceList: IEvidence[],
  evidencesNumPlaintiff: (string | undefined)[],
  evidencesNumDefendant: (string | undefined)[],
  plaintiffFileVolume: number,
  defendantFileVolume: number,
  hints: IHint[],
  coverPDF: ArrayBuffer | undefined,
  otherAuthor: string | undefined,
  downloadNewAdditionally: boolean,
  downloadEvidencesAdditionally: boolean,
  regard: string | undefined,
  dontDownloadAttachments: boolean
) {
  let basisdokumentObject: any = {};
  basisdokumentObject["fileId"] = fileId;
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
  basisdokumentObject["evidences"] = evidenceList;
  basisdokumentObject["evidencesNumPlaintiff"] = evidencesNumPlaintiff;
  basisdokumentObject["evidencesNumDefendant"] = evidencesNumDefendant;
  basisdokumentObject["plaintiffFileVolume"] = plaintiffFileVolume;
  basisdokumentObject["defendantFileVolume"] = defendantFileVolume;
  basisdokumentObject["judgeHints"] = hints;
  basisdokumentObject["otherAuthor"] = otherAuthor;
  basisdokumentObject["regard"] = regard;

  const date: Date =
    basisdokumentObject["versions"][basisdokumentObject["versions"].length - 1][
      "timestamp"
    ];
  const dateString = `${date.getDate().toString().padStart(2, "0")}-${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${date.getFullYear().toString().padStart(2, "0")}_${date
    .getHours()
    .toString()
    .padStart(2, "0")}-${date.getMinutes().toString().padStart(2, "0")}`;
  const caseIdForFilename = caseId.trim().replace(/ /g, "-");

  downloadObjectAsJSON(
    basisdokumentObject,
    `basisdokument_version_${currentVersion}_az_${caseIdForFilename}_${dateString}`
  );
  downloadBasisdokumentAsPDF(
    coverPDF,
    downloadNewAdditionally,
    downloadEvidencesAdditionally,
    evidenceList,
    basisdokumentObject,
    `basisdokument_version_${currentVersion}_az_${caseIdForFilename}_${dateString}`
  );
  if (!dontDownloadAttachments) {
    downloadAdditionalFiles(evidenceList);
  }
}

export function downloadEditFile(
  fileId: string,
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
  editFileObject["fileId"] = fileId;
  editFileObject["caseId"] = caseId;
  editFileObject["fileType"] = "editFile";
  editFileObject["currentVersion"] = currentVersion;
  editFileObject["highlightedEntries"] = highlightedEntries;
  editFileObject["highlighter"] = colorSelection;
  editFileObject["notes"] = notes;
  editFileObject["bookmarks"] = bookmarks;
  editFileObject["individualSorting"] = individualSorting;
  editFileObject["individualEntrySorting"] = individualEntrySorting;

  const date = new Date();
  const dateString = `${date.getDate().toString().padStart(2, "0")}-${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${date.getFullYear().toString().padStart(2, "0")}_${date
    .getHours()
    .toString()
    .padStart(2, "0")}-${date.getMinutes().toString().padStart(2, "0")}`;
  const caseIdForFilename = caseId.trim().replace(/ /g, "-");

  downloadObjectAsJSON(
    editFileObject,
    `bearbeitungsdatei_version_${currentVersion}_az_${caseIdForFilename}_${dateString}`
  );
}
