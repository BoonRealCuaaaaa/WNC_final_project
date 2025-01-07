import { FeePayer, PaymentTransaction } from "@/types/PaymentTransaction";
import { StateCreator } from "zustand";

export interface CustomerSlice {
  accountNumber: string,
  balance: number,
  email: string,
  update: (accountNumber: string, balance: number) => void,
  updateEmail: (data: string) => void,
  paymentTransaction: PaymentTransaction,
  resetPaymentTransaction: () => void,
  updatePaymentTransaction: (data: PaymentTransaction) => void,
}

const createCustomerSlice: StateCreator<
  CustomerSlice
> = (set) => ({
  accountNumber: "",
  balance: 0,
  email: "",
  update: (accountNumber: string, balance: number) => set(() => ({ accountNumber, balance })),
  updateEmail: (data: string) => set(() => ({ email: data })),
  paymentTransaction: {
    id: -1,
    amount: 0,
    content: "",
    desOwner: "",
    desAccount: "",
    desBankName: import.meta.env.VITE_BANK_NAME,
    fee: 0,
    feePayer: FeePayer.SENDER
  },
  resetPaymentTransaction: () => set(() => ({paymentTransaction: {
    id: -1,
    amount: 0,
    content: "",
    desOwner: "",
    desAccount: "",
    desBankName: import.meta.env.VITE_BANK_NAME,
    fee: 0,
    feePayer: FeePayer.SENDER
  }})),
  updatePaymentTransaction: (data: PaymentTransaction) => set(() => ({paymentTransaction: data})),
})

export default createCustomerSlice;