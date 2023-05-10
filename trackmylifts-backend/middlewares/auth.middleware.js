const { userTypes } = require("../startups/config");
const { verifyAuthJwt } = require("../utils/auth.util");
const { error } = require("../utils/error.util");

const verifyAuth = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!accessToken) {
      return error.unauthorized("no token", res);
    }

    const user = verifyAuthJwt(accessToken);

    req.user = user;
    next();
  } catch (err) {
    error.unauthorized("Unauthorized: " + err.message, res);
  }
};

const verifyUser = (req, res, next) => {
  try {
    const user = req.user;

    const { id } = req.params;

    if (id === "me") {
      req.params.id = user.id;
    } else {
      const sameUser = id === user.id;
      const isAdmin = [userTypes.ADMIN].some((type) => type === user.type);
      if (!sameUser || !isAdmin) throw new Error("Cannot access this user!");
    }

    next();
  } catch (err) {
    error.unauthorized("Unauthorized: " + err.message, res);
  }
};

const verifyUserType = (...allowedUserTypes) => {
  return (req, res, next) => {
    const isPresent = allowedUserTypes.includes(req.user.type);
    if (!isPresent) return errorResponse(res, { code: 403, message: "User doesn't have the permission to access the resource." });

    next();
  };
};

module.exports = { verifyAuth, verifyUser, verifyUserType };
