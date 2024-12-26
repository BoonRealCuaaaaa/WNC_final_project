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