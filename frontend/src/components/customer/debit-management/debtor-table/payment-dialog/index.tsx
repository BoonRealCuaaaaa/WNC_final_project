import { Button } from "@/components/ui/button";
import { Input, Steps } from "antd";
import { CheckSquare } from "react-bootstrap-icons";

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
import { useState } from "react";
import { formatCurrency } from "@/shared/lib/utils/format-currency";
import { generateDebitOtpApi, payDebitApi } from "@/api/debits.api";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

const PaymentDialog = ({ record, refetchDebits, preOpen = false }) => {
  const { toast } = useToast();
  const [openPaymentModal, setOpenPaymentModal] = useState(preOpen);
  const [currentStep, setCurrentStep] = useState(0);
  const [otp, setOtp] = useState("");

  const { mutate: generateOtp } = useMutation({
    mutationFn: generateDebitOtpApi,
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi tạo OTP",
        variant: "destructive",
      });
    },
  });

  const { mutate: payDebit } = useMutation({
    mutationFn: payDebitApi,
    onSuccess: () => {
      refetchDebits();
      setOtp("");
      setCurrentStep(0);
      toast({
        title: "Thanh toán nợ thành công",
        description: "Bạn đã thanh toán nợ thành công",
      });
      setOpenPaymentModal(false);
    },
    onError: (error: AxiosError) => {
      setOtp("");
      setCurrentStep(0);
      setOpenPaymentModal(false);
      console.log(error);

      const errorMessage =
        (error.response?.data as { message: string }).message ==
        "Not enough balance"
          ? "Số dư của bạn không đủ để thanh toán nợ"
          : "Bạn đã thanh toán nợ thất bại, vui lòng thử lại sau";

      toast({
        title: "Thanh toán nợ thất bại",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handlePayDebit = (debitId) => {
    if (otp.length < 6) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đủ 6 số OTP",
        variant: "destructive",
      });
      return;
    }

    payDebit({ debitId, otp });
  };
  return (
    <AlertDialog open={openPaymentModal} onOpenChange={setOpenPaymentModal}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="p-0">
          <CheckSquare />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Thanh toán nợ</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="flex flex-col space-y-5">
              <Steps current={currentStep} direction="horizontal">
                <Steps.Step title="Thông tin nhắc nợ" />
                <Steps.Step title="Xác thực OTP" />
              </Steps>
              {currentStep === 0 && (
                <div className="flex flex-col space-y-3 ">
                  <div className="self-center">
                    {`Xác nhận thanh toán nợ với ${
                      record.fullName
                    }, số tiền ${formatCurrency(record.amount)}`}
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="flex flex-col space-y-5">
                  <div className="self-center">{`Nhập OTP để xác thực thanh toán nợ với với ${
                    record.fullName
                  } số tiền ${formatCurrency(record.amount)}`}</div>
                  <div className="w-full flex justify-center self-center">
                    <Input.OTP
                      onInput={(text) => {
                        setOtp(text.join(""));
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setCurrentStep(0);
            }}
          >
            Cancel
          </AlertDialogCancel>
          {currentStep === 0 ? (
            <Button
              onClick={() => {
                generateOtp({ debitId: record.id });
                setCurrentStep(1);
              }}
            >
              Tiếp tục
            </Button>
          ) : (
            <Button
              onClick={() => {
                handlePayDebit(record.id);
              }}
            >
              Hoàn tất
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PaymentDialog;
