import { Button } from "./Button"
import { DotsThree, Notepad, X, FloppyDisk, PencilSimpleLine, Scales, Trash, TextBolder, TextStrikethrough, TextUnderline,
TextAlignCenter, TextAlignJustify, TextAlignLeft, TextAlignRight, TextItalic, ListBullets, ListNumbers, CaretUp} from "phosphor-react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export const Meta = () => {
    return (
        <div className="bg-offWhite h-full overflow-y-scroll p-4 space-y-4">
            <div className="max-w-[1200px] m-auto"></div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-start-1 col-span-1 font-bold">
                        <Button
                            bgColor="bg-lightGrey"
                            textColor="text-darkGrey"
                            size="sm"
                            alternativePadding="p-1"
                            icon={<CaretUp size={14} />}
                            onClick={() => void {}}
                            position="end">
                            KLAGEPARTEI
                        </Button>
                        
                        
                    </div>
                    <div className="bg-lightPurple text-black p-4 rounded-lg col-start-1 col-span-1">
                        <div className="flex justify-between">
                            <h3 className="font-bold">Kurt Huber</h3>
                            <span className="inline-flex">
                                <Button
                                    bgColor="transparent"
                                    textColor="text-darkGrey"
                                    icon={<Notepad size={18} />}
                                    alternativePadding="p-1"
                                    onClick={() => void {}}
                                />
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger>
                                <Button 
                                    bgColor="transparent"
                                    textColor="text-darkGrey"
                                    icon={<DotsThree size={18} />}
                                    alternativePadding="p-1"
                                    onClick={() => void {}}
                                />
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Portal>
                                    <DropdownMenu.Content className="bg-white rounded-lg shadow-md">
                                        <DropdownMenu.Item>
                                            <Button
                                                bgColor="bg-white"
                                                size="sm"
                                                textColor="text-darkGrey"
                                                icon={<PencilSimpleLine size={12} />}>
                                                Bearbeiten
                                            </Button>
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Separator/>
                                        <DropdownMenu.Item className="pb-1 border-b-2 border-lightGrey">
                                            <Button
                                                bgColor="bg-white"
                                                size="sm"
                                                textColor="text-darkGrey"
                                                icon={<Scales size={12} />}
                                                onClick={() => void {}}>
                                                Hinweis hinzufügen
                                            </Button>
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item>
                                            <Button
                                                bgColor="bg-white"
                                                size="sm"
                                                textColor="text-vibrantRed"
                                                icon={<Trash size={12} />}
                                                onClick={() => void {}}>
                                                Beschreibung löschen
                                            </Button>
                                        </DropdownMenu.Item>
                                    </DropdownMenu.Content>
                                </DropdownMenu.Portal>
                                </DropdownMenu.Root>
                            </span>
                        </div>
                        <p className="mt-8">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            Consequuntur dolorum earum dolores omnis odit, voluptas
                            ratione? Praesentium reprehenderit perspiciatis repudiandae
                            officia veniam qui facere at deserunt, harum ab pariatur
                            beatae?
                        </p>
                    </div>
                    <div className="col-start-2 col-span-1 row-start-1 row-span-1 font-bold">
                        <Button
                            bgColor="bg-lightPetrol"
                            textColor="text-darkGrey"
                            size="sm"
                            alternativePadding="p-1"
                            icon={<CaretUp size={14} />}
                            position="end"
                            >BEKLAGTENPARTEI
                        </Button>
                    </div>
                    <div className="bg-lightPetrol text-black p-4 rounded-lg col-start-2 col-span-1">
                        <div className="flex justify-between">
                            <h3 className="font-bold">Kurt Huber</h3>
                            <span className="inline-flex">
                                    <Button
                                        bgColor="transparent"
                                        textColor="text-darkGrey"
                                        icon={<Notepad size={18} />}
                                        alternativePadding="p-1"
                                        onClick={() => void {}}
                                    />
                                    <DropdownMenu.Root>
                                    <DropdownMenu.Trigger>
                                <Button 
                                    bgColor="transparent"
                                    textColor="text-darkGrey"
                                    icon={<DotsThree size={18} />}
                                    alternativePadding="p-1"
                                    onClick={() => void {}}
                                />
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Portal>
                                    <DropdownMenu.Content className="bg-white rounded-lg shadow-md">
                                        <DropdownMenu.Item>
                                            <Button
                                                bgColor="bg-white"
                                                size="sm"
                                                textColor="text-darkGrey"
                                                icon={<PencilSimpleLine size={12} />}
                                                onClick={() => void {}}>
                                                Bearbeiten
                                            </Button>
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Separator/>
                                        <DropdownMenu.Item className="pb-1 border-b-2 border-lightGrey">
                                            <Button
                                                bgColor="bg-white"
                                                size="sm"
                                                textColor="text-darkGrey"
                                                icon={<Scales size={12} />}
                                                onClick={() => void {}}>
                                                Hinweis hinzufügen
                                            </Button>
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item>
                                            <Button
                                                bgColor="bg-white"
                                                size="sm"
                                                textColor="text-vibrantRed"
                                                icon={<Trash size={12} />}
                                                onClick={() => void {}}>
                                                Beschreibung löschen
                                            </Button>
                                        </DropdownMenu.Item>
                                    </DropdownMenu.Content>
                                </DropdownMenu.Portal>
                                </DropdownMenu.Root>
                            </span>
                    </div>
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
                        <p className="">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            Consequuntur dolorum earum dolores omnis odit, voluptas
                            ratione? Praesentium reprehenderit perspiciatis repudiandae
                            officia veniam qui facere at deserunt, harum ab pariatur
                            beatae?Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            Consequuntur dolorum earum dolores omnis odit, voluptas
                            ratione? Praesentium reprehenderit perspiciatis repudiandae
                            officia veniam qui facere at deserunt, harum ab pariatur
                            beatae? 
                        </p>
                        <span className="flex gap-2 font-bold mt-8 justify-end">
                            <Button
                                bgColor="bg-lightRed"
                                size="sm"
                                textColor="text-darkRed"
                                icon={<X size={14} />}>Verwerfen</Button>
                            <Button
                                bgColor="bg-lightGreen"
                                size="sm"
                                textColor="text-darkGreen"
                                icon={<FloppyDisk size={14} />}>Speichern</Button>
                        </span>
                    </div>
                </div>
        </div>
    )
}