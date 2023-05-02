const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { AUTH_JWT_SECRET } = require("../startups/config");

async function matchPassword(password1, password2) {
  const matched = bcrypt.compare(password1, password2);

  return matched;
}

function getAuthJwt(data = {}) {
  return jwt.sign(data, AUTH_JWT_SECRET, { expiresIn: "1h" });
}

function verifyAuthJwt(token) {
  return jwt.verify(token, AUTH_JWT_SECRET);
}

module.exports = { matchPassword, getAuthJwt, verifyAuthJwt };
