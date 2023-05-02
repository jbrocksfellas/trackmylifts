const User = require("../models/user.model");
const TrainingSession = require("../models/training_session.model");
const { matchPassword, getAuthJwt } = require("../utils/auth.util");
const { handleError, error, errorResponse } = require("../utils/error.util");
const Exercise = require("../models/exercise.model");
const { dayjs } = require("../utils/date.util");

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
    const trainingSession = await TrainingSession.findOne({ userId: id, "exercises._id": exercise._id }, {}, { sort: { _id: -1 } });
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
      date: { $gte: new Date(year, month - 1, day), $lt: new Date(year, month - 1, day + 1) },
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
