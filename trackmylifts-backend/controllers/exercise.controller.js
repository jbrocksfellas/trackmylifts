const Exercise = require("../models/exercise.model");
const { handleError } = require("../utils/error.util");

exports.searchExercises = async (req, res) => {
  try {
    const { query } = req.query;

    const exercises = await Exercise.find({ $text: { $search: query } }, {}, { limit: 10 }).lean();

    res.json({
      exercises: exercises.map((exercise) => ({
        id: exercise._id,
        name: exercise.name,
      })),
    });
  } catch (err) {
    handleError(err, res);
  }
};
