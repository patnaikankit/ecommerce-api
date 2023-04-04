// all the routes will be created in this page
const express = require("express");
const router = express.Router();
// importing the logic from the desired route
const registerController = require("../controllers");



// in order to register a new user
router.post("/register", registerController.register);


module.exports = router;