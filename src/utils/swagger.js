import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Booklist API Documentation",
      version: "1.0.0",
      description: "API documentation for the Booklist management system",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
  },
  // Path to the API docs (where JSDoc comments are)
  apis: ["./src/modules/**/*.router.js", "./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  // Swagger UI route
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format (optional)
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log("Swagger docs available at http://localhost:3000/api-docs");
};
