import instance from "@/utils/axios";

export const getBeneficiariesApi = async () => {
   return instance.get("/beneficiaries");
};
