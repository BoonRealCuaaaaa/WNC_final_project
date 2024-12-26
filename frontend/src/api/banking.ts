import instance from "@/utils/axios";

export const postSearchAccountsApi = async ({
  accountNumber,
}: {
  bankName: string;
  accountNumber: string;
}) => {
  return instance.post("/payment-transaction/banking/search-account", {
    accountNumber,
  });
};

export const postGenerateOtpForBankingApi = async ({
  desBankName,
  desAccountNumber,
  amount,
  content,
}: {
  desBankName: string;
  desAccountNumber: string;
  amount: number;
  content: string;
}) => {
  return instance.post("/payment-transaction/banking/otp", {
    desBankName,
    desAccountNumber,
    amount,
    content,
  });
};
