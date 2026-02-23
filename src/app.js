import express from "express";
import cors from "cors";
import routes from "src/routes";
import { setupSwagger } from "src/utils/swagger";

const app = express();

app.use(cors());
app.use(express.json());

// Documentation
setupSwagger(app);

// Routes
app.use("/", routes);

export default app;
