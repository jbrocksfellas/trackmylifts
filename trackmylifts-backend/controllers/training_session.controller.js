const TrainingSession = require("../models/training_session.model");
const Exercise = require("../models/exercise.model");
const { handleError, error } = require("../utils/error.util");
const { getTrainingSessionDates } = require("../utils/training_session.util");
const User = require("../models/user.model");

exports.createTrainingSession = async (req, res) => {
  try {
    const user = req.user;

    const userObj = await User.findOne({ _id: user.id }).lean();

    const userTimezone = userObj.timezone;

    const { startDate, endDate } = getTrainingSessionDates(new Date(), userTimezone);

    // console.log(startDate.format(), endDate.format());

    const trainingSession = await TrainingSession.findOne({
      userId: user.id,
      date: { $gte: startDate.format(), $lt: endDate.format() },
    }).lean();
    if (trainingSession) return error.badRequest("Session is already created", res);

    const newTrainingSession = new TrainingSession({ userId: user.id, exercises: [] });
    const session = await newTrainingSession.save();

    res.json({ id: session._id, date: session.date, exercises: [] });
  } catch (err) {
    handleError(err, res);
  }
};

exports.deleteTrainingSession = async (req, res) => {
  try {
    const trainingSession = req.trainingSession;

    await TrainingSession.deleteOne({ _id: trainingSession._id });

    res.sendStatus(204);
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

exports.deleteExerciseById = async (req, res) => {
  try {
    const trainingSession = req.trainingSession;

    const { exerciseId } = req.params;

    await TrainingSession.updateOne({ _id: trainingSession._id }, { $pull: { exercises: { _id: exerciseId } } }).lean();

    res.sendStatus(204);
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

    const updatedTrainingSession = await TrainingSession.findOneAndUpdate(
      { _id: trainingSession._id, "exercises._id": exercise._id },
      { $push: { "exercises.$.sets": { reps, weight } } },
      { new: true }
    ).lean();

    const newSets = updatedTrainingSession.exercises.find((exercise) => exercise._id.toString() === exerciseId).sets;
    const newSetId = newSets[newSets.length - 1]._id;

    res.json({ id: newSetId, reps, weight });
  } catch (err) {
    handleError(err, res);
  }
};

exports.deleteSetById = async (req, res) => {
  try {
    const trainingSession = req.trainingSession;

    const { exerciseId, setId } = req.params;

    await TrainingSession.updateOne({ _id: trainingSession._id, "exercises._id": exerciseId }, { $pull: { "exercises.$.sets": { _id: setId } } }).lean();

    res.sendStatus(204);
  } catch (err) {
    handleError(err, res);
  }
};

exports.updateSetById = async (req, res) => {
  try {
    const trainingSession = req.trainingSession;

    const { exerciseId, setId } = req.params;
    const { reps, weight } = req.body;

    const updatedTrainingSession = await TrainingSession.findOneAndUpdate(
      { _id: trainingSession._id, "exercises._id": exerciseId, "exercises.sets._id": setId },
      {
        $set: {
          "exercises.$[exercise].sets.$[set].reps": reps,
          "exercises.$[exercise].sets.$[set].weight": weight,
        },
      },
      {
        arrayFilters: [{ "exercise._id": exerciseId }, { "set._id": setId }],
        new: true,
      }
    ).lean();
    if (!updatedTrainingSession) return error.notFound("Set", res);

    res.json({ id: setId, reps, weight });
  } catch (err) {
    handleError(err, res);
  }
};
