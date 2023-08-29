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

  return (
    <>
      {/* TODO: centern */}
      <div className="opacity-25 fixed inset-0 z-40 bg-black !m-0" />
      <div className="justify-center items-center flex bg-white overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none w-fit h-fit px-5 rounded-md shadow-md">
        <div className="my-6 mx-auto w-fit">
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

          <div className="flex justify-center w-full">
            <img
              src={filedata}
              alt={`Beweis ${title}: Bild zu Anlage ${attachmentId} mit dem Filename ${filename}`}></img>
          </div>
          <span className="text-sm">{`Bild zu Anlage ${attachmentId}: ${filename}`}</span>
        </div>
      </div>
    </>
  );
};
