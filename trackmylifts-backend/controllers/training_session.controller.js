const TrainingSession = require("../models/training_session.model");
const Exercise = require("../models/exercise.model");
const { handleError, error } = require("../utils/error.util");
const { dayjs } = require("../utils/date.util");

exports.createTrainingSession = async (req, res) => {
  try {
    const user = req.user;

    const userTimezone = "Asia/Calcutta";

    const currentUtcTime = new Date();

    const userLocalTime = dayjs(currentUtcTime).tz(userTimezone);

    const year = userLocalTime.year();
    const month = userLocalTime.month() + 1;
    const day = userLocalTime.date();

    const trainingSession = await TrainingSession.findOne({
      userId: user.id,
      date: { $gte: new Date(year, month - 1, day), $lt: new Date(year, month - 1, day + 1) },
    }).lean();
    if (trainingSession) return error.badRequest("Session is already created", res);

    const newTrainingSession = new TrainingSession({ userId: user.id, exercises: [] });
    const session = await newTrainingSession.save();

    res.json({ id: session._id, date: session.date, exercises: [] });
  } catch (err) {
    handleError(err, res);
  }
};

exports.createExercise = async (req, res) => {
  try {
    const trainingSession = req.trainingSession;

    const { exerciseId } = req.body;

    const alreadyPresent = trainingSession.exercises.some((exercise) => exercise._id.toString() === exerciseId);
    if (alreadyPresent) return error.badRequest("Exercise already present!", res);

    const exercise = await Exercise.findOne({ _id: exerciseId }).lean();
    if (!exercise) return error.notFound("Exercise", res);

    const newExercise = { _id: exercise._id, sets: [] };

    await TrainingSession.findOneAndUpdate({ _id: trainingSession._id }, { $push: { exercises: newExercise } }).lean();

    res.json({ exercise: { id: newExercise._id, sets: newExercise.sets } });
  } catch (err) {
    handleError(err, res);
  }
};

exports.createSet = async (req, res) => {
  try {
    const trainingSession = req.trainingSession;

    const { exerciseId } = req.params;
    const { reps, weight } = req.body;
    if (!(reps && weight)) return error.badRequest("Invalid body", res);

    const exercisePresent = trainingSession.exercises.some((exercise) => exercise._id.toString() === exerciseId);
    if (!exercisePresent) error.notFound("Exercise", res);

    const exercise = await Exercise.findOne({ _id: exerciseId }).lean();
    if (!exercise) return error.notFound("Exercise", res);

    const ex = trainingSession.exercises.find((exercise) => exercise._id.toString() === exerciseId);
    const setLength = ex.sets.length;

    await TrainingSession.findOneAndUpdate(
      { _id: trainingSession._id, "exercises._id": exercise._id },
      { $push: { "exercises.$.sets": { id: setLength + 1, reps, weight } } }
    ).lean();

    res.json({ id: setLength + 1, reps, weight });
  } catch (err) {
    handleError(err, res);
  }
};
