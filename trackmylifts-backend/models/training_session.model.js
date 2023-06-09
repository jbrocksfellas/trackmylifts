const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const setSchema = new mongoose.Schema({
  id: { type: Number, requied: true, min: [1, "Cannot enter less than 1 rep"] },
  reps: { type: Number, required: true, min: [1, "Cannot enter less than 1 kg"] },
  weight: { type: Number, required: true },
});

const exerciseSchema = new mongoose.Schema({
  _id: { type: ObjectId, required: true, ref: "Exercise" },
  sets: [{ type: setSchema, required: true }],
});

const trainingSessionSchema = new mongoose.Schema(
  {
    userId: { type: ObjectId, required: true, ref: "User" },
    date: { type: Date, required: true, default: () => Date.now() },
    exercises: [{ type: exerciseSchema, required: true }],
  },
  { timestamps: true }
);

const Exercise = mongoose.model("Training_Session", trainingSessionSchema);

module.exports = Exercise;
