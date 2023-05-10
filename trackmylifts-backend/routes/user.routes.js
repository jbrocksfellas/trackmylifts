const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { verifyAuth, verifyUser } = require("../middlewares/auth.middleware");

router.post("/", userController.createUser);
router.post("/login", userController.loginWithEmail);
router.get("/verify-email/:session", userController.verifyEmail);

router.use(verifyAuth);
router.get("/:id", verifyUser, userController.findUserById);
router.put("/:id/timezone", verifyUser, userController.updateUserTimezone);
router.get("/:id/training-sessions/last-volume", verifyUser, userController.findLastExerciseVolume);
router.get("/:id/training-sessions/today", verifyUser, userController.findTodayTrainingSession);

module.exports = router;
