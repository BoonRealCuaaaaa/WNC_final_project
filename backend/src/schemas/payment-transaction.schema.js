export const payDebitSchema = {
  type: "object",
  properties: {
    debitId: { type: "integer" },
    otp: { type: "string" },
  },
  required: ["debitId", "otp"],
  additionalProperties: false,
};

export const tradeInterbankSchema = {
  type: "object",
  properties: {
    payload: {
      type: "object",
      properties: {
        amount: { type: "number" },
        otp: { type: "string" },
        paymentTransactionId: {type: "number"}
      },
      required: ["amount", "paymentTransactionId", "otp"],
      additionalProperties: false,
    },
    time: { type: "number" },
    signature: { type: "string" },
    token: { type: "string" },
    domain: { type: "string" },
  },
  required: ["time", "signature", "token", "domain", "payload"],
  additionalProperties: false,
};
