export const createCustomerAccountSchema = {
  type: "object",
  properties: {
    username: { type: "string" },
    password: { type: "string", minLength: 6 },
    fullName: { type: "string" },
    email: {
      type: "string",
      pattern: "^[\\w\\.-]+@([\\w\\.-]+\\.)+[A-Za-z]{2,4}$",
    },
    phone: { type: "string", pattern: "^[0-9]{10,15}$" },
  },
  required: ["username", "password", "fullName", "email", "phone"],
  additionalProperties: false,
};

export const depositToAccountSchema = {
  type: "object",
  properties: {
    accountNumber: { type: "string", pattern: "^[0-9]+$" },
    amount: { type: "string", pattern: "^[0-9]+$" },
  },
  required: ["accountNumber", "amount"],
  additionalProperties: false,
};
