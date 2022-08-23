import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from "../Button"
import { DotsThree, PencilSimpleLine, Scales, Trash} from "phosphor-react";

export const Dropdown = () => {
    return(
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
    )
}