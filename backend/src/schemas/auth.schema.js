export const loginSchema = {
   type: "object",
   properties: {
      username: { type: "string" },
      password: { type: "string" },
   },
   required: ["username", "password"],
   additionalProperties: false,
};

export const refreshTokenSchema = {
   type: "object",
   properties: {
      refreshToken: { type: "string" },
   },
   required: ["refreshToken"],
   additionalProperties: false,
};
