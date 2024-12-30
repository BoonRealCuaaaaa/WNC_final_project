export const payDebitSchema = {
  type: "object",
  properties: {
    debitId: { type: "integer" },
    otp: { type: "string" },
  },
  required: ["debitId", "otp"],
  additionalProperties: false,
};

export const bankingSchema = {
  type: "object",
  properties: {
    debitId: { type: "integer" },
    otp: { type: "string" },
  },
  required: ["debitId", "otp"],
  additionalProperties: false,
};

export const searchAccountSchema = {
  type: "object",
  properties: {
    accountNumber: { type: "string" },
  },
  required: ["accountNumber"],
  additionalProperties: false,
};

export const generateOtpForBankingSchema = {
  type: "object",
  properties: {
    desBankName: {type: "string"}, 
    desAccountNumber: {type: "string"}, 
    amount: { type: "integer" },
    content: {type: "string"},
    feeMethod: {type: "string"}
  },
  required: ["desBankName", "desAccountNumber", "amount"],
  additionalProperties: false,
};
export const bankTransferSchema = {
  type: "object",
  properties: {
    amount: { type: "number" },
    content: { type: "string" },
    desBankName: { type: "string" },
    desAccount: { type: "string" },
    feePayer: { type: "string" },
  },
  required: ["amount", "desBankName", "desAccount", "feePayer"],
  additionalProperties: false,
}

export const payBankTransferSchema = {
  type: "object",
  properties: {
    id: { type: "integer" },
    otp: { type: "string" },
  },
  required: ["id", "otp"],
  additionalProperties: false,
}