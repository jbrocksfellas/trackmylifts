const router = require("express").Router();
const exerciseController = require("../controllers/exercise.controller");
const { verifyAuth } = require("../middlewares/auth.middleware");

router.use(verifyAuth);
router.get("/", exerciseController.searchExercises);

module.exports = router;
