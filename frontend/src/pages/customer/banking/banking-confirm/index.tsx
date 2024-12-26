import BankingConfirmation from "@/components/customer/banking/banking-confimation";
import { useLocation } from "react-router-dom";

export default function BankingConfimationPage() {
  const location = useLocation();
  const infor: {
    fullName: string;
    accountNumber: string;
    amount: string;
    bankName: string;
    content: string;
    feeMethod: string;
    fee: number;
    transactionId: number;
  } = location.state;

  const handleConfirm = (code: string) => {
    console.log("Confirming with code:", code);
    // Add your logic here to handle the confirmation
  };

  const handleResendCode = () => {
    console.log("Resending code...");
    // Add your logic here to resend the code
  };

  console.log("location.state:::", location.state);

  return (
    <div className="w-full flex justify-center">
      <BankingConfirmation
        recipientName={infor.fullName}
        recipientAccountNumber={infor.accountNumber}
        recipientBank={infor.bankName}
        bankingAmount={infor.amount}
        fee={infor.fee}
        feeMethod={infor.feeMethod}
        transactionId={infor.transactionId}
        bankingContent={infor.content}
        onConfirm={handleConfirm}
        onResendCode={handleResendCode}
      />
    </div>
  );
}
