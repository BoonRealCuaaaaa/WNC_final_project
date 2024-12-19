import { Button } from "@/components/ui/button";
import { List, ListContent, ListDescription, ListHeader, ListTitle, ListTitleGroup } from "@/components/ui/list";
import AccountListItem from "./list-item";
import { Account } from "@/types/receiver";

export default function AccountList() {
    const receivers: Account[] = [
        {
            owner: "Nguyen Trong Dai",
            cardNumber: "1234567890123456",
            bank: "Ngân hàng A"
        },
        {
            owner: "Hoang",
            cardNumber: "1234567890123456",
            bank: "Ngân hàng A"
        },
        {
            owner: "Nguyen Trong Dai",
            cardNumber: "1234567890123456",
            bank: "Ngân hàng A"
        },
        {
            owner: "Nguyen Trong Dai",
            cardNumber: "1234567890123456",
            bank: "Ngân hàng A"
        },
        {
            owner: "Nguyen Trong Dai",
            cardNumber: "1234567890123456",
            bank: "Ngân hàng A"
        },
        {
            owner: "Nguyen Trong Dai",
            cardNumber: "1234567890123456",
            bank: "Ngân hàng A"
        },
        {
            owner: "Nguyen Trong Dai",
            cardNumber: "1234567890123456",
            bank: "Ngân hàng A"
        },
    ]

    return (
        <List>
            <ListHeader>
                <ListTitleGroup>
                    <ListTitle>Danh sách người thụ hưởng</ListTitle>
                    <ListDescription>{receivers.length} người</ListDescription>
                </ListTitleGroup>
                <Button>
                    Thêm người thụ hưởng
                </Button>
            </ListHeader>
            <ListContent>
                {receivers.map(receiver => <AccountListItem receiver={receiver} />)}
            </ListContent>
        </List>
    );
};
