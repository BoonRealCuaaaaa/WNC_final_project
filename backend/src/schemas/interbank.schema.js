export const handleTradeInterbankSchema = {
  type: "object",
  properties: {
    payload: {
      type: "object",
      properties: {
        amount: { type: "number" },
        accountNumber: { type: "string" },
      },
      required: ["amount", "accountNumber"],
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

export const searchInterbankAccountSchema = {
  type: "object",
  properties: {
    bankName: { type: "string" },
    accountNumber: { type: "string" },
  },
  required: ["bankName", "accountNumber"],
  additionalProperties: false,
};

export const handleSearchInterbankAccountSchema = {
  type: "object",
  properties: {
    payload: {
      type: "object",
      properties: {
        accountNumber: { type: "string" },
      },
      required: ["accountNumber"],
      additionalProperties: false,
    },
    time: { type: "number" },
    token: { type: "string" },
    domain: { type: "string" },
  },
  required: ["time", "token", "domain", "payload"],
  additionalProperties: false,
};
