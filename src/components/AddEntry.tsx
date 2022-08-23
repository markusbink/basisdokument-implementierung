import { Button } from "./Button";
import { Plus } from "phosphor-react"

export const AddEntry = () => {
    return(
        <div className="grid grid-col-2 inline-flex gap-4">
            <span className="col-start-1">
            <Button
                icon={<Plus size={18} />}>Beitrag hinzufügen
            </Button>
            </span>
            <span className="col-start-2">
            <Button
                icon={<Plus size={18} />}>Beitrag hinzufügen
            </Button>
            </span>
        </div>
    )
}