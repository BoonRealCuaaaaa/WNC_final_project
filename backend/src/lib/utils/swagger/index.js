import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Interbank API",
      version: "1.0.0",
      description: "API for interbank transactions",
    },
  },
  apis: ["./src/routes/*.js"],
};

export const specs = swaggerJSDoc(options);
