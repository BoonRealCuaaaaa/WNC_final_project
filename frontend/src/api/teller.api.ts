import instance from "@/utils/axios";


export const getTellersApi = async () => {
   const data = (await instance.get("/admin/tellers")).data;
   console.log("teller::", data);
   return data;
}
