const User = require("../models/user.model");
const TrainingSession = require("../models/training_session.model");
const { matchPassword, getAuthJwt } = require("../utils/auth.util");
const { handleError, error, errorResponse } = require("../utils/error.util");
const Exercise = require("../models/exercise.model");
const { dayjs } = require("../utils/date.util");
const { sendEmail } = require("../services/email.service");
const EmailVerification = require("../models/email_verification.model");
const { FRONTEND_URL, API_URL } = require("../startups/config");
const crypto = require("crypto");

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const lowerCaseEmail = email.toLowerCase();

    const newUser = new User({ firstName, lastName, email, password });

    const user = await newUser.save();

    const emailSession = crypto.randomBytes(64).toString("hex");
    const emailVerification = new EmailVerification({ userId: user._id, email: lowerCaseEmail, session: emailSession });
    await emailVerification.save();

    sendEmail({
      to: lowerCaseEmail,
      subject: "Email Verification",
      html: `Click <a href="${API_URL}/v1/users/verify-email/${emailSession}">Here</a> to verify email.`,
    });

    res.json({ message: "User created!" });
  } catch (err) {
    handleError(err, res);
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { session } = req.params;
    if (!session) return res.send("<h2>Invalid link.</h2>");

    const emailVerification = await EmailVerification.findOneAndDelete({ session }).lean();
    if (!emailVerification) return res.redirect(FRONTEND_URL + "/login");

    await User.findOneAndUpdate({ _id: emailVerification.userId }, { $set: { emailVerified: true } }).lean();

    res.redirect(FRONTEND_URL + "/login");
  } catch (err) {
    handleError(res, err);
  }
};

exports.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).lean();
    if (!user) return error.badRequest("Invalid email or password!", res);

    if (!user.emailVerified) return error.forbidden("Please verify your email first", res);

    const matched = await matchPassword(password, user.password);
    if (!matched) return error.badRequest("Invalid email or password!", res);

    const token = getAuthJwt({
      sub: user._id.toString(),
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      type: user.type,
      photo: user.photo,
    });

    res.json({
      accessToken: token,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, type: user.type, photo: user.photo },
    });
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

exports.findLastExerciseVolume = async (req, res) => {
  try {
    const { id } = req.params;
    const { exerciseId } = req.query;
    if (!exerciseId) {
      // training session volume
    }

    const exercise = await Exercise.findOne({ _id: exerciseId }).lean();
    if (!exercise) return error.notFound("Exercise", res);

    // const user = await User.findOne({ _id: id }).lean();

    let volume = 0;
    const trainingSession = await TrainingSession.findOne({ userId: id, "exercises._id": exercise._id }, {}, { sort: { _id: -1 } })
      .lean()
      .skip(1);
    if (trainingSession) {
      const exercise = trainingSession.exercises.find((exercise) => exercise._id.toString() === exerciseId);
      exercise.sets.forEach((set) => {
        volume += set.reps * set.weight;
      });
    }

    res.json({ volume });
  } catch (err) {
    handleError(err, res);
  }
};

exports.findTodayTrainingSession = async (req, res) => {
  try {
    const { id } = req.params;

    const userTimezone = "Asia/Calcutta"; // replace with user's timezone

    const currentUtcTime = new Date();

    const userLocalTime = dayjs(currentUtcTime).tz(userTimezone);

    const year = userLocalTime.year();
    const month = userLocalTime.month() + 1; // Note that moment uses 0-indexed months
    const day = userLocalTime.date();

    const trainingSession = await TrainingSession.findOne({
      userId: id,
      date: { $gte: new Date(year, month - 1, day).toISOString(), $lt: new Date(year, month - 1, day + 1).toISOString() },
    })
      .lean()
      .populate("exercises._id");
    if (!trainingSession) return error.notFound("Training Session", res);

    res.json({
      id: trainingSession._id,
      date: trainingSession.date,
      exercises: trainingSession.exercises.map((exercise) => {
        return {
          exercise: { id: exercise._id._id, name: exercise._id.name },
          sets: exercise.sets,
        };
      }),
    });
  } catch (err) {
    handleError(err, res);
  }
};
