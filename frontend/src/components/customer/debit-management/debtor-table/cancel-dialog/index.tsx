import { cancelDebitApi } from "@/api/debits.api";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { XLg } from "react-bootstrap-icons";
import { useForm } from "react-hook-form";

const CancelDialog = ({ refetchDebits, record }) => {
  const { toast } = useToast();
  const [openCancelModal, setOpenCancelModal] = useState(false);

  const { mutate: cancelDebit } = useMutation({
    mutationFn: cancelDebitApi,
    onSuccess: () => {
      refetchDebits();
      setValueCancel("cancelReason", "");
      toast({
        title: "Hủy nhắc nợ thành công",
        description: "Bạn đã hủy nhắc nợ thành công",
      });
    },
    onError: () => {
      toast({
        title: "Hủy nhắc nợ thất bại",
        description: "Bạn đã hủy nhắc nợ thất bại, vui lòng thử lại sau",
        variant: "destructive",
      });
    },
  });

  const {
    register: registerCancel,
    handleSubmit: handleSubmitCancel,
    setValue: setValueCancel,
  } = useForm({
    defaultValues: {
      id: "",
      cancelReason: "",
    },
  });

  const onDeleteDebit = (data) => {
    cancelDebit({ debitId: data.id, cancelReason: data.cancelReason });
  };

  return (
    <AlertDialog open={openCancelModal} onOpenChange={setOpenCancelModal}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="p-0">
          <XLg />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hủy nhắc nợ </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <form
              onSubmit={handleSubmitCancel((data) =>
                onDeleteDebit({ ...data, id: record.id })
              )}
            >
              <div className="flex flex-col space-y-5">
                <div>{`Bạn có chắc chắn muốn hủy nhắc nợ với ${record.fullName} không?`}</div>
                <textarea
                  className="border border-gray-300 inline-flex h-20 w-full resize-none appearance-none items-center justify-center rounded-lg p-2.5 text-[15px] leading-none outline-none focus:shadow-[0_0_0_2px_black]"
                  required
                  placeholder="Nhập lý do nhắc nợ"
                  {...registerCancel("cancelReason")}
                />
              </div>
              <AlertDialogFooter className="mt-5">
                <AlertDialogCancel>Trở về</AlertDialogCancel>
                <Button type="submit">Hủy nhác nợ</Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelDialog;
