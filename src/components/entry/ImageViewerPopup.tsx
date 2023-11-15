import { X } from "phosphor-react";

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
  if (!isVisible) {
    return null;
  }

  var filetype = filedata.substring(
    filedata.indexOf(":") + 1,
    filedata.indexOf(";")
  );

  return (
    <>
      <div className="opacity-25 fixed inset-0 z-50 bg-black !m-0" />
      <div className="justify-center -translate-y-1/2 -translate-x-1/2 left-1/2 top-1/2 items-center flex bg-white overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none w-fit h-fit px-5 rounded-md shadow-md">
        <div className="my-6 mx-auto w-fit max-h-[75vh] max-w-[75vw]">
          <div className="flex justify-between">
            <h3>{title}</h3>
            <div>
              <button
                onClick={() => {
                  setIsVisible(false);
                }}
                className="text-darkGrey bg-offWhite p-1 rounded-md hover:bg-lightGrey">
                <X size={24} />
              </button>
            </div>
          </div>
          <div className="flex justify-center w-full overflow-auto mb-3">
            <embed src={filedata} type={filetype}></embed>
          </div>
          <span className="text-sm text-darkGrey opacity-80">{`${
            filetype.includes("image") ? "TIFF" : "PDF"
          } zu Anlage ${attachmentId}: ${filename}`}</span>
        </div>
      </div>
    </>
  );
};
