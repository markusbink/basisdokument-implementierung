import { Button } from "./Button";
import { Plus } from "phosphor-react"

export const AddPoint = () => {
    return(
        <div className="flex justify-end border-t-[1px] border-mediumGrey pt-4 mt-8">
          <Button size="sm"
          icon={<Plus weight="bold" />}
            > Gliederungspunkt hinzufügen
          </Button>
        </div>
    )
}