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
const { getTrainingSessionDates } = require("../utils/training_session.util");

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, timezone } = req.body;

    const lowerCaseEmail = email.toLowerCase();

    const newUser = new User({ firstName, lastName, email, password, timezone });

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

    res.json({ id: user._id, email: user.email, type: user.type, timezone: user.timezone });
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

    const userObj = await User.findOne({ _id: id }).lean();
    if (!userObj) return error.notFound("User", res);

    const userTimezone = userObj.timezone;

    const { startDate, endDate } = getTrainingSessionDates(new Date(), userTimezone);

    // console.log(startDate.format(), endDate.format());

    const trainingSession = await TrainingSession.findOne({
      userId: id,
      createdAt: { $gte: startDate.format(), $lt: endDate.format() },
    })
      .lean()
      .populate("exercises._id");
    if (!trainingSession) return error.notFound("Training Session", res);

    res.json({
      id: trainingSession._id,
      exercises: trainingSession.exercises.map((exercise) => {
        return {
          exercise: { id: exercise._id._id, name: exercise._id.name },
          sets: exercise.sets.map((set) => ({
            id: set._id,
            reps: set.reps,
            weight: set.weight,
          })),
        };
      }),
      createdAt: trainingSession.createdAt,
    });
  } catch (err) {
    handleError(err, res);
  }
};

exports.updateUserTimezone = async (req, res) => {
  try {
    const { id } = req.params;
    const { timezone } = req.body;

    await User.updateOne({ _id: id }, { timezone: timezone }).lean();

    res.sendStatus(204);
  } catch (err) {
    handleError(err, res);
  }
};
