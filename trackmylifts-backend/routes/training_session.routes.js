const router = require("express").Router();
const trainingSessionController = require("../controllers/training_session.controller");
const { verifyAuth } = require("../middlewares/auth.middleware");
const { verifyTrainingSession } = require("../middlewares/verify.middleware");

router.use(verifyAuth);
router.post("/", trainingSessionController.createTrainingSession);
router.post("/:id/exercises", verifyTrainingSession, trainingSessionController.createExercise);

module.exports = router;
