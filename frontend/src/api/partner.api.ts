import instance from "@/utils/axios";

export const getPartners = () => {
   return instance.get("/partners");
};