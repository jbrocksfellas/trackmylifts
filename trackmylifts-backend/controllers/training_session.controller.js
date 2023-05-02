const TrainingSession = require("../models/training_session.model");
const Exercise = require("../models/exercise.model");
const { handleError, error } = require("../utils/error.util");
const { dayjs } = require("../utils/date.util");

exports.createTrainingSession = async (req, res) => {
  try {
    const user = req.user;

    const timezone = "Asia/Calcutta";

    // if today session is not found then create

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tzToday = dayjs(today).tz(timezone);

    console.log(today, tzToday);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tzTomorrow = dayjs(tomorrow).tz(timezone);

    res.json({});
  } catch (err) {
    handleError(err, res);
  }
};

exports.createExercise = async (req, res) => {
  try {
    const trainingSession = req.trainingSession;

    console.log(trainingSession);

    const { exerciseId } = req.body;

    const alreadyPresent = trainingSession.exercises.some((exercise) => exercise._id.toString() === exerciseId);
    if (alreadyPresent) error.badRequest("Exercise already present!", res);

    const exercise = await Exercise.findOne({ _id: exerciseId }).lean();
    if (!exercise) error.notFound("Exercise", res);

    const newExercise = { _id: exercise._id, sets: [] };

    const newTrainingSession = await TrainingSession.findOneAndUpdate({ _id: trainingSession._id }, { $push: { exercises: newExercise } }).lean();

    res.json({ exercise: newExercise });
  } catch (err) {
    handleError(err, res);
  }
};
