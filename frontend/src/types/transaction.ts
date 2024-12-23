export type Transaction = {
  id: number;
  amount: number;
  content: string;
  status: string;
  srcAccount: string;
  srcBankName: string;
  desAccount: string;
  desBankName: string;
  createdAt: Date;
  updatedAt: Date;
};
