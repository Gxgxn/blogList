require("dotenv").config();

const PORT = process.env.PORT || 3005;
const MONGO_URI = process.env.MONGODB_URI;

module.exports = { PORT, MONGO_URI };
