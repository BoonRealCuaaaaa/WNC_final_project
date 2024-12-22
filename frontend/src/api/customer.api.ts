import instance from "@/utils/axios";

export const checkExistApi = (accountNumber) => {
   return instance.post("/customer/status", { accountNumber });
};

export const checkUsernameExistApi = (username) => {
   return instance.post("/customer/username/status", { username });
};

export const getPaymentHistoryApi = () => {
   return instance.get("/payment-transaction/history");
}

export const getPaymentAccountApi = () => {
   return instance.get("/customer/payment-account");
}