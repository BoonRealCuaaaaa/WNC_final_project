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
