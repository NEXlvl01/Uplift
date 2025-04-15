const express = require("express");
const {getQuizQuestions,submitQuiz} = require("../controllers/quiz.controller.js");

const router = express.Router();

router.get("/questions/:category",getQuizQuestions);
router.post("/submit", submitQuiz);

module.exports = router;