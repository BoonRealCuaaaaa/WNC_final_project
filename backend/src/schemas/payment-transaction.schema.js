export const payDebitSchema = {
  type: "object",
  properties: {
    debitId: { type: "integer" },
    otp: { type: "string" },
  },
  required: ["debitId", "otp"],
  additionalProperties: false,
};
