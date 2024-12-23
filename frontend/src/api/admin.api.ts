import instance from "@/utils/axios";

export const getAllTellersApi = async () => {
   return (await instance.get("/admin/tellers")).data;
}

export const getAllTransactionsApi = async () => {
    return (await instance.get("/admin/transactions-history")).data;
 }
