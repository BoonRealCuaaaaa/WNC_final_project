import instance from "@/utils/axios";

export const getCreatedDebitApi = async () => {
   return instance.get("/debits/created");
};

export const getReceivedDebitApi = async () => {
   return instance.get("/debits/received");
};

export const createDebitApi = async ({ accountNumber, amount, content }) => {
   return instance.post("/debits", { accountNumber, amount, content });
};

export const cancelDebitApi = async ({ debitId, cancelReason }) => {
   return instance.post("/debits/cancel", { id: debitId, reason: cancelReason });
};

export const generateDebitOtpApi = async ({ debitId }) => {
   return instance.post("/payment-transaction/debit/otp", { debitId });
};

export const payDebitApi = async ({ debitId, otp }) => {
   return instance.post("/payment-transaction/debit", { debitId, otp });
};
