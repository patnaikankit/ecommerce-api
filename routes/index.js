// all the routes will be created in this page
import express from 'express';
const router = express.Router();
// importing the logic from the desired route
import { registerController, loginController, userController, refreshController } from '../controllers/index.js';
import auth from "../middleware/auth.js"



// in order to register a new user
router.post("/register", registerController.register);

// user trying to login
router.post("/login", loginController.login);

// to fetch user data
router.get("/me", auth, userController.me);

// token generation
router.post("/refresh", refreshController.refresh);

export default router;