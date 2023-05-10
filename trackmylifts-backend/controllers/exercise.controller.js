const Exercise = require("../models/exercise.model");
const { userTypes } = require("../startups/config");
const { handleError } = require("../utils/error.util");

exports.searchExercises = async (req, res) => {
  try {
    const { query } = req.query;

    const findWith = {};
    if (query) findWith["$text"] = { $search: query };

    const exercises = await Exercise.find(findWith, {}, { sort: { _id: -1 } }).lean();

    const isAdmin = req.user.type === userTypes.ADMIN;

    res.json({
      exercises: exercises.map((exercise) => {
        const obj = {
          id: exercise._id,
          name: exercise.name,
        };

        if (isAdmin) obj.tags = exercise.tags;

        return obj;
      }),
    });
  } catch (err) {
    handleError(err, res);
  }
};

exports.createExercise = async (req, res) => {
  try {
    const { name, tags } = req.body;

    const exercise = await Exercise.create({ name, tags });

    res.json({
      id: exercise._id,
      name: exercise.name,
      tags: exercise.tags,
    });
  } catch (err) {
    handleError(err, res);
  }
};

exports.updateExerciseById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, tags } = req.body;

    const exercise = await Exercise.findOneAndUpdate({ _id: id }, { name, tags }, { new: true }).lean();

    res.json({ id: exercise._id, name: exercise.name, tags: exercise.tags });
  } catch (err) {
    handleError(err, res);
  }
};

exports.deleteExerciseById = async (req, res) => {
  try {
    const { id } = req.params;

    await Exercise.deleteOne({ _id: id }).lean();

    res.sendStatus(204);
  } catch (err) {
    handleError(err, res);
  }
};
