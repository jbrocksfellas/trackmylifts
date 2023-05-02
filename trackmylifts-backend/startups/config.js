require("dotenv").config();

exports.MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;


// jwt
exports.AUTH_JWT_SECRET = process.env.AUTH_JWT_SECRET

// usertypes
exports.userTypes = {
  ADMIN: "admin"
}