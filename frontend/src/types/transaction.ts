export type Transaction = {
  id: number;
  amount: number;
  content: string;
  status: string;
  srcAccount: string;
  srcBankName: string;
  srcPerson: string;
  desAccount: string;
  desBankName: string;
  desPerson: string;
  createdAt: Date;
  updatedAt: Date;
};
