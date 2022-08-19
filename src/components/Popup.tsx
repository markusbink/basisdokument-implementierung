import { Button } from "./Button"
import { Warning } from "phosphor-react"


export const Popup = () => {
    return(
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
        p-8 bg-white rounded-lg content-center shadow-lg">
            <div className="rounded-full h-20 w-20 flex items-center justify-center bg-lightRed p-4 m-auto">
                <Warning color="darkRed" size={64}/>
            </div>

            <div className="font-bold w-64 flex justify-center text-center p-4 m-auto">
                Sind Sie sicher, dass Sie den Beitrag löschen möchten?
            </div>
            
            <div className="flex flex-basis gap-4 justify-center font-bold mt-8 w-full mx-auto">
                <Button
                bgColor="bg-offWhite"
                textColor="black">
                    <p className="w-32">Abbrechen</p>
                </Button>
                <Button
                bgColor="bg-lightRed"
                textColor="text-darkRed">
                   <p className="w-32">Löschen</p> 
                </Button>
            </div>
        </div>
    )
}