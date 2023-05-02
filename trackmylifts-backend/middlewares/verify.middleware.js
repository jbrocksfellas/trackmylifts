const TrainingSession = require("../models/training_session.model");
const { error } = require("../utils/error.util");
const { userTypes } = require("../startups/config");

const verifyTrainingSession = async (req, res, next) => {
  try {
    const user = req.user;

    const { id } = req.params;

    const trainingSession = await TrainingSession.findOne({ _id: id }).lean();
    if (!trainingSession) return error.notFound("Training session", res);

    const isAdmin = [userTypes.ADMIN].includes(user.type);
    const isResourceOwner = trainingSession.user_id.toString() === user.id;

    if (!(isAdmin || isResourceOwner)) return error.forbidden("Cannot access this training session!", res);

    req.trainingSession = trainingSession;

    next();
  } catch (err) {
    error.unauthorized("Unauthorized: " + err.message, res);
  }
};

module.exports = { verifyTrainingSession };
