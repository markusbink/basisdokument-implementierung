import { Warning } from "phosphor-react";

interface ErrorPopupProps {
  isVisible: boolean;
  children: React.ReactNode;
}

export const ErrorPopup: React.FC<ErrorPopupProps> = ({
  isVisible,
  children,
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <>
      <div className="opacity-25 fixed inset-0 z-40 bg-black !m-0" />
      <div className="fixed inset-0 flex flex-col justify-center items-center z-50">
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            p-8 bg-white rounded-lg content-center shadow-lg space-y-8 w-full max-w-[400px]"
        >
          <div className="space-y-4">
            <div className="rounded-full h-20 w-20 flex items-center justify-center bg-lightRed p-4 m-auto">
              <Warning color="darkRed" size={64} />
            </div>
            <div className="text-center space-y-8">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};
