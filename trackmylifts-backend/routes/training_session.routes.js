const router = require("express").Router();
const trainingSessionController = require("../controllers/training_session.controller");
const { verifyAuth } = require("../middlewares/auth.middleware");
const { verifyTrainingSession } = require("../middlewares/verify.middleware");

router.use(verifyAuth);
router.post("/", trainingSessionController.createTrainingSession);

router.route("/:id").delete(verifyTrainingSession, trainingSessionController.deleteTrainingSession);

router.post("/:id/exercises", verifyTrainingSession, trainingSessionController.createExercise);
router.route("/:id/exercises/:exerciseId").delete(verifyTrainingSession, trainingSessionController.deleteExerciseById);

router.post("/:id/exercises/:exerciseId/sets", verifyTrainingSession, trainingSessionController.createSet);
router
  .route("/:id/exercises/:exerciseId/sets/:setId")
  .put(verifyTrainingSession, trainingSessionController.updateSetById)
  .delete(verifyTrainingSession, trainingSessionController.deleteSetById);

module.exports = router;
