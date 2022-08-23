
import { Button } from "../Button"
import { TextBolder, TextStrikethrough, TextUnderline,
    TextAlignCenter, TextAlignJustify, TextAlignLeft, TextAlignRight, TextItalic, ListBullets, ListNumbers} from "phosphor-react";

export const Toolbar = () => {
    return(
        <div className="flex inline-flex my-2 gap-4">
                    <span className="inline-flex gap-1">
                        <Button
                            icon={<TextBolder size={18} />}
                            bgColor="bg-offWhite"
                            textColor="text-black"
                            size="sm"
                            alternativePadding="p-1"
                            onClick={() => void {}}
                        />
                        <Button
                            icon={<TextItalic size={18} />}
                            bgColor="bg-offWhite"
                            textColor="text-black"
                            size="sm"
                            alternativePadding="p-1"
                            onClick={() => void {}}
                        />
                        <Button
                            icon={<TextUnderline size={18} />}
                            bgColor="bg-offWhite"
                            textColor="text-black"
                            size="sm"
                            alternativePadding="p-1"
                            onClick={() => void {}}
                        />
                        <Button
                            icon={<TextStrikethrough size={18} />}
                            bgColor="bg-offWhite"
                            textColor="text-black"
                            size="sm"
                            alternativePadding="p-1"
                            onClick={() => void {}}
                        />
                    </span>
                    <span className="inline-flex gap-1">
                        <Button
                            icon={<ListBullets size={18} />}
                            bgColor="bg-offWhite"
                            textColor="text-black"
                            size="sm"
                            alternativePadding="p-1"
                            onClick={() => void {}}
                        />
                        <Button
                            icon={<ListNumbers size={18} />}
                            bgColor="bg-offWhite"
                            textColor="text-black"
                            size="sm"
                            alternativePadding="p-1"
                            onClick={() => void {}}
                        />
                    </span>
                    <span className="inline-flex gap-1">
                        <Button
                            icon={<TextAlignLeft size={18} />}
                            bgColor="bg-offWhite"
                            textColor="text-black"
                            size="sm"
                            alternativePadding="p-1"
                            onClick={() => void {}}
                        />
                        <Button
                            icon={<TextAlignCenter size={18} />}
                            bgColor="bg-offWhite"
                            textColor="text-black"
                            size="sm"
                            alternativePadding="p-1"
                            onClick={() => void {}}
                        />
                        <Button
                            icon={<TextAlignRight size={18} />}
                            bgColor="bg-offWhite"
                            textColor="text-black"
                            size="sm"
                            alternativePadding="p-1"
                            onClick={() => void {}}
                        />
                        <Button
                            icon={<TextAlignJustify size={18} />}
                            bgColor="bg-offWhite"
                            textColor="text-black"
                            size="sm"
                            alternativePadding="p-1"
                            onClick={() => void {}}
                        />
                    </span>
                    </div>
    )
}