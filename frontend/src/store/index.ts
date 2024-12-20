import { create } from "zustand";
import createCustomerSlice, { CustomerSlice } from "./slices/customer";

const useAppStore = create<
    CustomerSlice
>()((...args) => ({
    ...createCustomerSlice(...args),
}))

export default useAppStore;
