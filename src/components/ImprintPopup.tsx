import { X } from "phosphor-react";
import { useImprint } from "../contexts";
import cx from "classnames";

export const ImprintPopup = () => {
  const { setShowImprintPopup } = useImprint();

  return (
    <>
      <div
        className={cx(
          "justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        )}>
        <div className="w-auto my-6 mx-auto w-[700px]">
          {/*content*/}
          <div className="p-6 space-y-4 border-0 rounded-lg shadow-lg flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between rounded-lg ">
              <h3 className="text-xl font-bold text-darkGrey">Impressum</h3>
              <div>
                <button
                  onClick={() => {
                    setShowImprintPopup(false);
                  }}
                  className="text-darkGrey bg-offWhite p-1 rounded-md hover:bg-lightGrey">
                  <X size={24} />
                </button>
              </div>
            </div>
            {/*body*/}
            <div className="space-y-4 border rounded-md p-2">
              <div className="font-bold">Angaben gemäß §5 TMG</div>
              <div>
                <p className="text-sm">Universität Regensburg</p>
                <p className="text-sm">Universitätsstraße 31</p>
                <p className="text-sm">93053 Regensburg</p>
              </div>
              <div>
                <p className="font-bold">Vertreten durch:</p>
                <p className="text-sm">Prof. Dr. Christian Wolff</p>
                <p className="text-sm">Prof. Dr. Christoph Althammer</p>
              </div>
              <div>
                <p className="font-bold">Kontakt:</p>
                <p className="text-sm">Telefon: +49 (941) 943 - 5099</p>
                <p className="text-sm">Telefax: +49 (941) 943 - 3728</p>
                <p className="text-sm">
                  E-Mail:{" "}
                  <a href="mailto:support@parteivortrag.de">
                    support@parteivortrag.de
                  </a>
                </p>
              </div>
              <div>
                <p className="font-bold">Umsatzsteuer-ID:</p>
                <p className="text-sm">
                  Umsatzsteuer-ldentifikationsnummer (UST-ID) gemäß §27a
                  Umsatzsteuergesetz: DE 233 549 072
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};
