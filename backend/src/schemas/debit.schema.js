export const createDebitSchema = {
   type: "object",
   properties: {
      accountNumber: { type: "string" },
      amount: { type: "number" },
      content: { type: "string" },
   },
   required: ["accountNumber", "amount", "content"],
   additionalProperties: false,
};

export const cancelDebitSchema = {
   type: "object",
   properties: {
      id: { type: "number" },
      reason: { type: "string" },
   },
   required: ["id", "reason"],
   additionalProperties: false,
};


