require("dotenv").config();

// db
exports.MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;

// server
exports.PORT = process.env.PORT
exports.API_URL = process.env.API_URL

// frontend
exports.FRONTEND_URL = process.env.FRONTEND_URL;

// jwt
exports.AUTH_JWT_SECRET = process.env.AUTH_JWT_SECRET;

// email
exports.EMAIL_SENDER_ID = process.env.EMAIL_SENDER_ID;
exports.EMAIL_SENDER_PASSWORD = process.env.EMAIL_SENDER_PASSWORD;

// usertypes
exports.userTypes = {
  ADMIN: "admin",
};
