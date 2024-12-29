import instance from "@/utils/axios";

export const checkExistInterbankAccountsApi = async ({
  bankName,
  accountNumber,
}: {
  bankName: string;
  accountNumber: string;
}) => {
  return instance.post("/interbanks/search-interbank-account", {
    accountNumber,
    bankName,
  });
};
