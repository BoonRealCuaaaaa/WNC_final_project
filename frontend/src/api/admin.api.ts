import instance from "@/utils/axios";

export const getAllTellersApi = async () => {
  return (await instance.get("/admin/tellers")).data;
};

export const postTellerApi = async (teller: {
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
}) => {
  return (await instance.post("/admin/tellers", teller)).data;
};

export const updateTellerApi = async (
  tellerId: number,
  teller: {
    username?: string;
    password?: string;
    fullName?: string;
    email?: string;
    phone?: string;
  }
) => {
  return (await instance.patch(`/admin/tellers/${tellerId}`, teller)).data;
};

export const deleteTellerApi = async (tellerId: number) => {
  return (await instance.delete(`/admin/tellers/${tellerId}`)).data;
};

export const getAllTransactionsApi = async ({from, to, bankName}: {from: Date, to: Date, bankName: string}) => {
  return (await instance.get(`/admin/transactions-history?from=${from}&to=${to}&bankName=${bankName}`)).data;
};

export const addPartnerApi = async ({
  bankName,
  domain,
  partnerPublicKey,
  ourPrivateKey,
  ourPublicKey,
}) => {
  return instance.post("/admin/partner", {
    bankName,
    domain,
    partnerPublicKey,
    ourPrivateKey,
    ourPublicKey,
  });
};
