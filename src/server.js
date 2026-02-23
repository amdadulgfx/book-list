import app from "src/app";
import logger from "src/utils/logger";

const PORT = 3000;

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
