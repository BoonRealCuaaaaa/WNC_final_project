import instance from "@/utils/axios";

export const postSearchInterbankAccountsApi = async ({
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
