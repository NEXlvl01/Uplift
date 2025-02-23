const express = require('express');
const dotenv = require('dotenv');
const {dbConnect} = require("./DB/dbConnect.js");
const cors = require('cors');
const bodyParser = require('body-parser');
const userRouter = require("./routes/user.routes.js");
dotenv.config();
const app = express();

//middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());
app.use("/user",userRouter);

app.listen(process.env.PORT,() => {
    console.log(`Server Started At Port ${process.env.PORT}`);
});

dbConnect();