import { saveAs } from "file-saver";

function downloadObjectAsJSON(obj: object, fileName: string) {
  // Create a blob of the data
  var fileToSave = new Blob([JSON.stringify(obj)], {
    type: "application/json",
  });

  // Save the file
  saveAs(fileToSave, fileName);
}

export function downloadBasisdokument() {
  
}

export function downloadBearbeitungsdatei() {}
