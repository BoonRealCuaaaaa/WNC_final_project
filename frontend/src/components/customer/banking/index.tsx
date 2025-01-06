import { useState } from "react";
import CreateTransactionForm from "./create-transaction-form";
import BankingOtpForm from "./otp-form";
import { FeePayer, PaymentTransaction } from "@/types/PaymentTransaction";
import BankingResult from "./result";
import useAppStore from "@/store";

export default function Banking() {
    const [step, setStep] = useState<"CREATE_TRANSFER" | "OTP" | "RESULT">("CREATE_TRANSFER");
    const [receiver, setReceiver] = useState("");

    const {paymentTransaction, updatePaymentTransaction, updateEmail} = useAppStore((state) => state);

    const onCreateTransactionSuccesss = (data: PaymentTransaction, email: string) => {
        updateEmail(email);
        updatePaymentTransaction(data);
        setStep("OTP");
    }

    const onBankingResult = () => {
        setStep("RESULT");
    }

    const onReturnFromOTP = () => {
        updatePaymentTransaction({
            ...paymentTransaction,
            amount: paymentTransaction.amount + (paymentTransaction.feePayer === FeePayer.RECEVIER ? paymentTransaction.fee : 0)
        })
        setStep("CREATE_TRANSFER");
    }

    switch (step) {
        case "CREATE_TRANSFER":
            return <CreateTransactionForm receiver={receiver} setReceiver={setReceiver}  onCreateSuccess={onCreateTransactionSuccesss}/>
        case "OTP":
            return <BankingOtpForm receiverName={receiver} onReturn={onReturnFromOTP} onBankingResult={onBankingResult}/>
        case "RESULT":
            return <BankingResult receiverName={receiver} desAccount={paymentTransaction.desAccount} desBankName={paymentTransaction.desBankName} amount={paymentTransaction.feePayer === FeePayer.RECEVIER ? paymentTransaction.amount - paymentTransaction.fee : paymentTransaction.amount}/>
    }
}