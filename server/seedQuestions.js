require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const QuizQuestion = require("./models/question.model.js");

const seedDataPath = path.join(__dirname, "./quiz_questions_seed.json");

async function seedQuestions() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected...");

    const data = JSON.parse(fs.readFileSync(seedDataPath, "utf-8"));

    await QuizQuestion.deleteMany(); 
    await QuizQuestion.insertMany(data);

    console.log("✅ Quiz questions seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding quiz questions:", err);
    process.exit(1);
  }
}

seedQuestions();
