export const addTellerSchema = {
    type: "object",
    properties: {
       username: { type: "string" },
       password: { type: "string" },
       fullName: { type: "string" },
       email: { type: "string" },
       phone: { type: "string" },
    },
    required: ["username", "password", "fullName", "email", "phone"],
    additionalProperties: false,
 };
 