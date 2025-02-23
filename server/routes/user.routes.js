const express = require('express');
const {userLogin,userSignup,getUserByID} = require("../controllers/user.controller.js");

const router = express.Router();

router.post("/login",userLogin);
router.post("/signup",userSignup);
router.get("/:id",getUserByID);

module.exports = router;