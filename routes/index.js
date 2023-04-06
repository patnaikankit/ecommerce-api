// all the routes will be created in this page
import express from 'express';
const router = express.Router();
// importing the logic from the desired route
import { registerController, loginController } from '../controllers/index.js';



// in order to register a new user
router.post("/register", registerController.register);

// user trying to login
router.post("/login", loginController.login);

export default router;