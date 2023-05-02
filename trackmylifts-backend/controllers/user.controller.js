const User = require("../models/user.model");
const { matchPassword, getAuthJwt } = require("../utils/auth.util");
const { handleError, error, errorResponse } = require("../utils/error.util");

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const newUser = new User({ firstName, lastName, email, password });

    const user = await newUser.save();

    res.json({ message: "User created!" });
  } catch (err) {
    handleError(err, res);
  }
};

exports.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).lean();
    if (!user) return error.badRequest("Invalid email or password!", res);

    const matched = await matchPassword(password, user.password);
    if (!matched) return error.badRequest("Invalid email or password!", res);

    const token = getAuthJwt({ sub: user._id.toString(), id: user._id.toString(), email: user.email, type: user.type });

    res.json({ accessToken: token, user: { id: user._id, email: user.email, type: user.type } });
  } catch (err) {
    handleError(err, res);
  }
};

exports.findUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id }).lean();
    if (!user) return error.badRequest("Invalid email or password!", res);

    res.json({ id: user._id, email: user.email, type: user.type });
  } catch (err) {
    handleError(err, res);
  }
};
