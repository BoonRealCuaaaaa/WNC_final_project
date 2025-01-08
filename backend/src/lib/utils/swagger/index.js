import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi, { serve } from "swagger-ui-express";

export const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Internet Banking API",
      version: "1.0.0",
      description: "API for Internet Banking",
    },
  },
  apis: ["./src/routes/*.js"],
};

export const specs = swaggerJSDoc(options);
