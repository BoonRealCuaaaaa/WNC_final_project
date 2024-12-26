import instance from "@/utils/axios";

export const checkExistApi = (accountNumber) => {
  return instance.post("/customer/status", { accountNumber });
};

export const checkUsernameExistApi = (username) => {
   return instance.post("/customer/username/status", { username });
};

export const getPaymentHistoryApi = () => {
  return instance.get("/payment-transaction/history");
};

export const getPaymentAccountApi = () => {
  return instance.get("/customer/payment-account");
};

export const changePasswordApi = async ({ oldPassword, newPassword }) => {
  return instance.post("/customer/change-password", {
    oldPassword,
    newPassword,
  });
};

export const bankTransferApi = async ({amount, content, desAccount, desBankName, feePayer}) => {
  return instance.post("/payment-transaction/bank-transfer", {
    amount, content, desAccount, desBankName, feePayer
  })
}

export const payBankTransferApi = async ({id, otp}) => {
  return instance.post("/payment-transaction/bank-transfer/pay", {
    id, otp
  })
}