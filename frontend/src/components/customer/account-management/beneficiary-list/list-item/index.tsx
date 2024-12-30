import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ListAction, ListActionGroup, ListItem } from "@/components/ui/list";
import avatarImage from "@/assets/avatar.jpg"
import { Beneficiary } from "@/types/Beneficiary";
import { Description } from "@/components/ui/description";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash } from "lucide-react"
import { formatCardNumber } from "@/lib/string";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { deleteBeneficiaryApi } from "@/api/beneficiaries.api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { AxiosError } from "axios";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import EditBeneficiaryForm from "./edit-beneficiary-form";

interface Props {
    beneficiary: Beneficiary,
    onDeleteSuccess: () => void,
    onEditSuccess: () => void,
}

export default function BeneficiaryListItem({ beneficiary, onDeleteSuccess, onEditSuccess }: Props) {

    const { mutate: mutateDeleteBeneficiary } = useMutation({
        mutationFn: deleteBeneficiaryApi,
        onSuccess: (response) => {
            if (response.status === 200) {
                setIsDeleteOpen(false);
                onDeleteSuccess();
            }
        },
        onError: (error: AxiosError) => {
            setIsDeleteOpen(false);

            const message = (error.response?.data as { message: string }).message;

            toast({
                variant: "destructive",
                title: "Xóa người thụ hưởng thất bại",
                description: message,
            });
        },
    });

    const handleOnDeleteClick = () => {
        mutateDeleteBeneficiary({ id: beneficiary.id });
    }

    const handleOnEditSuccess = () => {
        setIsEditOpen(false);
        onEditSuccess();
    }

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [isEditOpen, setIsEditOpen] = useState(false);

    return (
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
            <ListActionGroup>
                <Dialog open={isEditOpen} onOpenChange={(state) => setIsEditOpen(state)} >
                    <DialogTrigger>
                        <ListAction><Edit /></ListAction>
                    </DialogTrigger>
                    <DialogContent>
                        <EditBeneficiaryForm beneficiary={beneficiary} onSuccess={handleOnEditSuccess} />
                    </DialogContent>
                </Dialog>

                <AlertDialog open={isDeleteOpen} onOpenChange={(state) => setIsDeleteOpen(state)}>
                    <AlertDialogTrigger>
                        <ListAction><Trash /></ListAction>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Xóa người thụ hưởng</AlertDialogTitle>
                            <AlertDialogDescription>
                                <span>Bạn có chắc muốn xóa người thụ hưởng </span>
                                <span className="text-foreground font-medium">{beneficiary.remindName ?? beneficiary.name}</span>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <Button variant="destructive" onClick={handleOnDeleteClick}>Xóa</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </ListActionGroup>
        </ListItem>
    )
}