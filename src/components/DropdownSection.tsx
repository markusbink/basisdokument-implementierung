import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from './Button';
import { DotsThree, Trash, CheckCircle, XCircle, Circle} from 'phosphor-react';

export const DropdownSection = () => {
    return(
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <Button
                    icon={<DotsThree size={18} weight="bold" />}
                    bgColor="offwhite"
                    textColor="lightGrey"
                />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content className='bg-darkGrey rounded-lg shadow-lg'>
                    <DropdownMenu.Item>
                        <Button
                            icon={<Trash size={18}/>}
                            size="sm">
                            Gliederungspunkt löschen
                        </Button>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item>
                        <Button
                            icon={<Circle size={18}/>}
                            size="sm">
                            Alle Streitigkeitsmarkierungen zurücksetzen
                        </Button>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item>
                        <Button
                            icon={<CheckCircle size={18}/>}
                            size="sm">
                            Alle Beiträge als unstreitig markieren
                        </Button>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item>
                        <Button
                            icon={<XCircle size={18}/>}
                            size="sm">
                            Alle Beiträge als streitig markieren
                        </Button>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}