import { StateCreator } from "zustand";

export interface CustomerSlice {
  accountNumber: string,
  balance: number,
  update: (accountNumber: string, balance: number) => void,
}

const createCustomerSlice: StateCreator<
  CustomerSlice
> = (set) => ({
  accountNumber: "",
  balance: 213213,
  update: (accountNumber: string, balance: number) => set(() => ({ accountNumber, balance })),
})

export default createCustomerSlice;