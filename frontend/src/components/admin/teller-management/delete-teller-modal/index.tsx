import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { PropsWithChildren } from "react";

interface DeleteTellerModalProps {
    handleDelete: (tellerId: number) => void;
    tellerName: string;
    tellerId: number;
}

type DeleteTellerModalWithChildrenProp = DeleteTellerModalProps & PropsWithChildren;

export default function DeleteTellerModal({
  children,
  handleDelete,
  tellerName,
  tellerId,
}: DeleteTellerModalWithChildrenProp) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa giao dịch viên</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa giao dịch viên {tellerName}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Hủy</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="outline" className="bg-red-500 hover:bg-red-600" onClick={() => handleDelete(tellerId)}>Xóa</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
