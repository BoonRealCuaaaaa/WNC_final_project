import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ListItem } from "@/components/ui/list";
import avatarImage from "@/assets/avatar.jpg"
import { Beneficiary } from "@/types/Beneficiary";
import { Description } from "@/components/ui/description";
import { Badge } from "@/components/ui/badge";
import { formatCardNumber } from "@/lib/string";
import {
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

interface Props {
    beneficiary: Beneficiary,
    onSelect: (beneficiary: Beneficiary) => void,
}

export default function ChooseBenificiaryListItem({ beneficiary, onSelect }: Props) {
    const handleOnSelect = () => {
        onSelect(beneficiary);
    }

    return (
        <DropdownMenuItem onSelect={handleOnSelect}>
            <ListItem>
                <div className="flex gap-x-4 flex-1">
                    <Avatar>
                        <AvatarImage src={avatarImage} />
                    </Avatar>
                    <div className="flex flex-col gap-y-2">
                        <span>{beneficiary.remindName ?? beneficiary.name}</span>
                        <div className="flex gap-x-2">
                            <Description>{formatCardNumber(beneficiary.accountNumber)}</Description>
                            {beneficiary.bank && <Badge variant="outline">{beneficiary.bank}</Badge>}
                        </div>
                    </div>
                </div>
            </ListItem>
        </DropdownMenuItem>
    )
}