const express = require("express");
const dotenv = require("dotenv");
const { dbConnect } = require("./DB/dbConnect.js");
const cors = require("cors");
const cron = require("node-cron");
const bodyParser = require("body-parser");
const { checkForAuthentication } = require("./middlewares/auth.middleware.js");
const userRouter = require("./routes/user.routes.js");
const campaignRouter = require("./routes/campaign.routes.js");
const paymentRouter = require("./routes/payment.routes.js");
const donationRouter = require("./routes/donation.routes.js");
const quizRouter = require("./routes/quiz.routes.js");
const { scheduledStatusUpdate } = require("./services/updateCampaignStatus.js");

dotenv.config();

const app = express();

cron.schedule("0 * * * *", scheduledStatusUpdate);

app.use(cors());
app.use(checkForAuthentication);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/user", userRouter);
app.use("/campaign", campaignRouter);
app.use("/payment", paymentRouter);
app.use("/donation", donationRouter);
app.use("/quiz", quizRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server Started At Port ${process.env.PORT}`);
});
dbConnect();
