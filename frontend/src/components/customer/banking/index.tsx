import { useState } from "react";
import CreateTransactionForm from "./create-transaction-form";
import BankingOtpForm from "./otp-form";
import { FeePayer, PaymentTransaction } from "@/types/PaymentTransaction";
import BankingResult from "./result";

export default function Banking() {
    const [step, setStep] = useState<"CREATE_TRANSFER" | "OTP" | "RESULT">("CREATE_TRANSFER");
    
    const [paymentTransaction, setPaymentTransaction] = useState<PaymentTransaction>({
        id: -1,
        amount: 0,
        content: "",
        desOwner: "",
        desAccount: "",
        desBankName: import.meta.env.VITE_BANK_NAME,
        fee: 0,
        feePayer: FeePayer.SENDER
    });

    const onCreateTransactionSuccesss = (data: PaymentTransaction) => {
        setPaymentTransaction(data);
        setStep("OTP");
    }

    const onBankingResult = () => {
        setStep("RESULT");
    }

    const onReturnFromOTP = () => {
        setPaymentTransaction({
            ...paymentTransaction,
            amount: paymentTransaction.amount + (paymentTransaction.feePayer === FeePayer.RECEVIER ? paymentTransaction.fee : 0)
        })
        setStep("CREATE_TRANSFER");
    }

    switch (step) {
        case "CREATE_TRANSFER":
            return <CreateTransactionForm onCreateSuccess={onCreateTransactionSuccesss} paymentTransaction={paymentTransaction}/>
        case "OTP":
            return <BankingOtpForm paymentTransaction={paymentTransaction} onReturn={onReturnFromOTP} onBankingResult={onBankingResult}/>
        case "RESULT":
            return <BankingResult />
    }
}