const mongoose = require("mongoose");

async function dbConnect() {
  const mongoDB = process.env.MONGO_URL;
  mongoose
    .connect(mongoDB)
    .then(() => {
      console.log("MongoDB Connected Successfully");
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = { dbConnect };
