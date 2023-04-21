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
import autoTable from "jspdf-autotable";
import { groupEntriesBySectionAndParent } from "../contexts/CaseContext";
import { format } from "date-fns";

//define data arrays
let allEntries: any[] = [];
let newEntries: any[] = [];
let rubrumKlage: any[] = [];
let rubrumBeklagt: any[] = [];
let basisdokument: any[] = [];
let allHints: any[] = [];

function downloadObjectAsJSON(obj: object, fileName: string) {
  // Create a blob of the data
  const fileToSave = new Blob([JSON.stringify(obj)], {
    type: "application/json",
  });

  // Save the file
  saveAs(fileToSave, fileName + ".txt");
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

//parse HTML to string to remove tags
function parseHTMLtoString(htmltext: any) {
  const parser = new DOMParser();
  const parserElem = parser.parseFromString(htmltext, "text/html");
  //add enumeration in ordered lists
  var orderedLists = parserElem.getElementsByTagName("ol");
  for (let i=0; i<orderedLists.length; i++) {
    let listitems = orderedLists[i].getElementsByTagName("li");
    for (let j=0; j<listitems.length; j++) {
      if (j === 0) {
        listitems[j].innerText = "\n" + (j + 1) + ". " + listitems[j].innerText;
      } else if (j === listitems.length-1) {
        listitems[j].innerText = (j + 1) + ". " + listitems[j].innerText + "\n";
      } else {
        listitems[j].innerText = (j + 1) + ". " + listitems[j].innerText;
      }
    }
  }
  //add bulletpoints in unordered lists
  var unorderedLists = parserElem.getElementsByTagName("ul");
  for (let i=0; i<unorderedLists.length; i++) {
    let bulletpoints = unorderedLists[i].getElementsByTagName("li");
    for (let j=0; j<bulletpoints.length; j++) {
      if (j === 0) {
        bulletpoints[j].innerText = "\n• " + bulletpoints[j].innerText;
      } else if (j === bulletpoints.length-1) {
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

function downloadBasisdokumentAsPDF(obj: any, fileName: string) {
  let pdfConverter = jsPDF,
    doc = new pdfConverter();
  // converter https://www.giftofspeed.com/base64-encoder/

  //DATA for autotables
  // basic data
  let basicData = {
    caseId: "Aktenzeichen: " + obj["caseId"],
    version: "Version: " + obj["currentVersion"],
    timestamp:
      "Export: " +
      obj["versions"][obj["versions"].length - 1]["timestamp"].toLocaleString(),
  };
  basisdokument.push(basicData);

  // Rubrum Plaintiff
  let metaPlaintiff;
  if (obj["metaData"]) {
    metaPlaintiff = obj["metaData"]["plaintiff"];
  } else {
    metaPlaintiff = "Es wurde kein Rubrum von der Klagepartei angelegt.";
  }
  rubrumKlage = [parseHTMLtoString(metaPlaintiff)];

  // Rubrum Defendant
  let metaDefendant;
  if (obj["metaData"]) {
    metaDefendant = obj["metaData"]["defendant"];
  } else {
    metaDefendant = "Es wurde kein Rubrum von der Beklagtenpartei angelegt.";
  }
  rubrumBeklagt = [parseHTMLtoString(metaDefendant)];

  // hints from the judge §139 ZPO
  if (obj["judgeHints"].length === 0) { //no hints
    allHints.push({ title: "Keine Hinweise", text: "Es wurden bisher keine Hinweise von der Richterin / dem Richter verfasst." });
  }

  for (let i=0; i< obj["judgeHints"].length; i++) {
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
        judgeHintObject.author + entryCodeText + " | " + judgeHintObject.title + " | Hinzugefügt am: " + getEntryTimestamp(judgeHintObject, obj),
      text: parseHTMLtoString(judgeHintObject.text),
      version: judgeHintObject.version,
    };
    allHints.push(hint);
  }

  // Get grouped entries
  let groupedEntries = groupEntriesBySectionAndParent(obj["entries"]);

  if (obj["sections"].length === 0) { //no entries
    allEntries.push({ id: "N", title: "Keine Beiträge", text: "Es wurden keine Gliederungspunkte / Beiträge von den Parteien angelegt." });
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
        };
        allEntries.push(tableEntry);

        //new entries
        let newEntry;
        if (entry.version === obj["currentVersion"]) {
          newEntry = {
            id: entry.entryCode,
            title:
              entry.entryCode + " | " + entry.author + " | " + entry.role,
            text: parseHTMLtoString(entry.text),
            version: entry.version,
            associatedEntry: getEntryTitle(entry.associatedEntry, obj),
          };
          newEntries.push(newEntry);
        }
      }
    }
  }

  // AUTOTABLES
  //autotable basisdokument metadata
  autoTable(doc, {
    theme: "grid",
    styles: { fontStyle: "bold" },
    head: [["Basisdokument"]],
    headStyles: { fontStyle: "bold", fontSize: 14, fillColor: [0, 102, 204] },
    body: [
      [basisdokument[0].caseId],
      [basisdokument[0].version],
      [basisdokument[0].timestamp],
    ],
    didDrawPage: function () {
      doc.outline.add(null, "Basisdokument-Metadaten", {
        pageNumber: doc.getCurrentPageInfo().pageNumber,
      });
    },
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
  rubrumBeklagt = [];

  //autotable hints
  doc.addPage();
  autoTable(doc, {
    theme: "grid",
    head: [["Hinweise des Richters nach (nach §139 ZPO)"]],
    headStyles: { fontStyle: "bold", fontSize: 12, fillColor: [0, 102, 204] },
    margin: { top: 6, bottom: 6, left: 6, right: 6 },
    didDrawPage: function () {
      doc.outline.add(null, "Hinweise des Richters nach (nach §139 ZPO)", {
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
  if (newEntries.length !== 0) { //only show new entries page if there are new entries
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
        data = [
          ["Neuer Beitrag"],
          [newEntries[i].title],
          [newEntries[i].associatedEntry],
          [newEntries[i].text],
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
            hookData.table.head[0].raw as unknown as string + //section
            " | " +
            hookData.table.body[0].raw as string + //section title plaintiff
            " | " +
            hookData.table.body[1].raw as string, //section title defendant
            { pageNumber: doc.getCurrentPageInfo().pageNumber, }
          );
        },
      });
    } else {
      let data;
      if (allEntries[i].associatedEntry !== undefined) {
        data = [
          [allEntries[i].title],
          [allEntries[i].associatedEntry],
          [allEntries[i].text],
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
          right: allEntries[i].id.includes("B") || allEntries[i].id === "N" ? 10 : 30,
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
          for (let j=0; j<currAllHints.length; j++) {
            if (currAllHints[j].id === currEntryId && hookData.row.index === 0) {
              if (currAllHints[j].id in counterArr) {
                counterArr[currAllHints[j].id] = counterArr[currAllHints[j].id] + 2;
              } else {
                counterArr[currAllHints[j].id] = 0;
              }
              let xPos = hookData.cursor?.x as number;
              let yPos = hookData.cursor?.y as number;
              let offset = counterArr[currAllHints[j].id]; //offset for multiple hints to an entry
              doc.createAnnotation({
                type: 'text',
                title: currAllHints[j].title,
                contents: currAllHints[j].text,
                bounds: {
                  x: currAllHints[j].id.includes('B') ? xPos - 10 + offset : xPos + hookData.cell.width + 2 + offset, //change position depending on defendant/plaintiff
                  y: yPos,
                  w: hookData.cell.contentWidth,
                  h: hookData.cell.contentHeight,
                },
                open: false,
              });
            }
          }
        }
      });
    }
  }
  allHints = [];
  allEntries = [];

  //signature page
  let signatureData:any = [[
    parseHTMLtoString(
      "Datum: " +
      obj["versions"][obj["versions"].length - 1]["timestamp"].toLocaleString().substring(0, 9) +
      "\n" +
      "\n" +
      "gez. " +
      "\n" +
      obj["versions"][obj["versions"].length - 1].author) +
      "\n" +
      getRoleProfession(obj["versions"][obj["versions"].length - 1].role)
  ]];
  autoTable(doc, {
    theme: 'grid',
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
  
  doc.save(fileName);
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
    basisdokumentObject,
    `basisdokument_version_${currentVersion}_az_${caseIdForFilename}_${dateString}`
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
