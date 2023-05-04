const config = require("./utils/config");
const app = require("./app");
const logger = require("./utils/logger");
app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
  logger.info(`Server running on port ${config.PORT}`);
});
