import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ListAction, ListActionGroup, ListItem } from "@/components/ui/list";
import avatarImage from "@/assets/avatar.jpg"
import { Receiver } from "@/types/receiver";
import { Description } from "@/components/ui/description";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash } from "lucide-react"
import { formatCardNumber } from "@/lib/string";

export default function ReceiverListItem({ receiver }: { receiver: Receiver }) {

    return (
        <ListItem>
            <div className="flex gap-x-4 flex-1">
                <Avatar>
                    <AvatarImage src={avatarImage} />
                </Avatar>
                <div className="flex flex-col gap-y-2">
                    <span>{receiver.owner}</span>
                    <div className="flex gap-x-2">
                        <Description>{formatCardNumber(receiver.cardNumber)}</Description>
                        <Badge variant="outline">{receiver.bank}</Badge>
                    </div>
                </div>
            </div>
            <ListActionGroup>
                <ListAction><Edit/></ListAction>
                <ListAction><Trash/></ListAction>
            </ListActionGroup>
        </ListItem>
    )
}