import { X } from "phosphor-react";
import { useEvidence } from "../../contexts/EvidenceContext";

interface ImageViewerPopupProps {
  filename: string;
  filedata: string;
  attachmentId: string;
  title: string;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ImageViewerPopup: React.FC<ImageViewerPopupProps> = ({
  filename,
  filedata,
  attachmentId,
  title,
  isVisible,
  setIsVisible,
}) => {
  const { getFileSize } = useEvidence();

  if (!isVisible) {
    return null;
  }

  const filetype = filedata.substring(
    filedata.indexOf(":") + 1,
    filedata.indexOf(";")
  );

  // source: https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
  const getFileDataBlob = (base64: string, base64Type: string) => {
    const base64Marker = ";base64,";
    const parts = base64.split(base64Marker);
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: base64Type });
  };

  const filedataurl =
    getFileSize(filedata) > 2000000
      ? URL.createObjectURL(getFileDataBlob(filedata, filetype))
      : filedata;

  return (
    <>
      <div className="opacity-25 fixed inset-0 z-50 bg-black !m-0" />
      <div className="justify-center -translate-y-1/2 -translate-x-1/2 left-1/2 top-1/2 items-center flex bg-white overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none w-fit h-fit px-5 rounded-md shadow-md">
        <div className="my-6 mx-auto">
          <div className="flex justify-between">
            <h3>{title}</h3>
            <div>
              <button
                onClick={() => {
                  setIsVisible(false);
                  URL.revokeObjectURL(filedataurl);
                }}
                className="text-darkGrey bg-offWhite p-1 rounded-md hover:bg-lightGrey">
                <X size={24} />
              </button>
            </div>
          </div>
          <div>
            <div className="flex justify-center w-full overflow-auto mb-3">
              <embed
                className="w-[40vw] h-[50vh]"
                src={filedataurl + "#navpanes=0"} // hide the nav-panel of pdf-embed at first
                type={filetype}></embed>
            </div>
            <span className="text-sm text-darkGrey opacity-80">{`${
              filetype.includes("image") ? "TIFF" : "PDF"
            } zu Anlage ${attachmentId}: ${filename}`}</span>
          </div>
          <span
            hidden={!filetype.includes("tiff")}
            className="text-xs pt-4 text-red-600">
            Hinweis: Eine TIFF-Vorschau ist derzeit leider nicht für alle
            Browser möglich. <br /> Bitte laden Sie das Basisdokument herunter,
            um alle Anlagen zu überprüfen.
          </span>
        </div>
      </div>
    </>
  );
};
