const router = require("express").Router();
const exerciseController = require("../controllers/exercise.controller");
const { verifyAuth, verifyUserType, verifyUser } = require("../middlewares/auth.middleware");
const { userTypes } = require("../startups/config");

router.use(verifyAuth);
router.get("/", exerciseController.searchExercises);
router.post("/", verifyUserType(userTypes.ADMIN), exerciseController.createExercise);
router.put("/:id", verifyUserType(userTypes.ADMIN), exerciseController.updateExerciseById);
router.delete("/:id", verifyUserType(userTypes.ADMIN), exerciseController.deleteExerciseById);

module.exports = router;
