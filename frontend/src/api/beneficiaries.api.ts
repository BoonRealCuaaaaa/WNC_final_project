import instance from "@/utils/axios";

export const getBeneficiariesApi = async () => {
   return instance.get("/beneficiaries");
};

export const createBeneficiaryApi = async ({bankName, accountNumber, remindName}) => {
   return instance.post("/beneficiaries", {
      bankName,
      accountNumber,
      shortName: remindName,
   });
}

export const deleteBeneficiaryApi = async ({id}) => {
   return instance.delete(`/beneficiaries/${id}`);
};

interface EditBeneficiarySchema {
   id: number,
   remindName: string,
   bankName: string,
   accountNumber: string,
}

export const editBeneficiaryApi = async (props: EditBeneficiarySchema) => {
   return instance.put("/beneficiaries", {
      id: props.id,
      shortName: props.remindName,
      bankName: props.bankName,
      accountNumber: props.accountNumber
   })
}