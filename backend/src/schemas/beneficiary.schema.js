export const createBeneficiarySchema = {
   type: "object",
   properties: {
      shortName: { type: "string" },
      bankName: { type: "string" },
      accountNumber: { type: "string" },
   },
   required: ["bankName", "accountNumber"],
   additionalProperties: false,
};

export const updateBeneficiarySchema = {
   type: "object",
   properties: {
      id: {type: "number"},
      shortName: { type: "string" },
      bankName: { type: "string" },
      accountNumber: { type: "string" },
   },
   required: ["id", "bankName", "accountNumber"],
   additionalProperties: false,
};
