export const tradeInterbankSchema = {
  type: "object",
  properties: {
    payload: {
      type: "object",
      properties: {
        amount: { type: "number" },
        otp: { type: "string" },
        paymentTransactionId: { type: "number" },
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

export const searchAccountsSchema = {
  type: "object",
  properties: {
    payload: {
      type: "object",
      properties: {
        accountNumber: { type: "number" },
      },
      required: ["amount", "paymentTransactionId", "otp"],
      additionalProperties: false,
    },
    time: { type: "number" },
    token: { type: "string" },
    domain: { type: "string" },
  },
  required: ["time", "token", "domain", "payload"],
  additionalProperties: false,
};
