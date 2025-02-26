const express = require('express');
const {userLogin,userSignup,getUserByID,updateUser} = require("../controllers/user.controller.js");

const router = express.Router();

router.post("/login",userLogin);
router.post("/signup",userSignup);
router.get("/:id",getUserByID);
router.put("/update/:id",updateUser);

module.exports = router;