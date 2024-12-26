export const payDebitSchema = {
  type: "object",
  properties: {
    debitId: { type: "integer" },
    otp: { type: "string" },
  },
  required: ["debitId", "otp"],
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