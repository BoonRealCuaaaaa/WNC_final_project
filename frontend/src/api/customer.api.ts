import instance from "@/utils/axios";

export const checkExistApi = (accountNumber) => {
   return instance.post("/customer/status", { accountNumber });
};
