import React from "react";
import {XCircle, WarningCircle, Quotes} from "phosphor-react";
import { Button } from "../Button";
import cx from "classnames";
import { ContentState, convertFromHTML, EditorState } from "draft-js";
import { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


export default function Header (){
    const [showModal, setShowModal] = React.useState(false);

    return (
        <header>
            <div className="flex items-start justify-between p-4 rounded-lg">
                    <h3 className="text-2xl font-bold text-darkGrey">
                      Neue Notiz verfassen
                    </h3>
                    <Button icon={<XCircle size={29} color="#3a4342" weight="fill"/>}
                      onClick={() => setShowModal(false)} 
                      bgColor="bg-transparent"
                      >
                    </Button>
                  </div>
                  <div className="flex space-x-4 mx-20 p-3 m-1 items-center justify-center bg-lightOrange rounded-lg text-xs font-bold text-darkOrange">
                    <div>
                        <WarningCircle> icon={<WarningCircle size={50} color="#894200" weight="bold" />}</WarningCircle>
                    </div>
                    <p>
                      Alle Notizen sind privat und können nicht von den anderen Parteien eingesehen werden. 
                      Sie können die Notitz zu jedem Zeitpunkt bearbeiten und löschen.
                    </p>
                    <div className="flex-1"></div>
                  </div>
        </header>
    )

}