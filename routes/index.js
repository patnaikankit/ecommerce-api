// all the routes will be created in this page
import express from 'express';
const router = express.Router();

// importing the logic from the desired route
import { registerController, loginController, userController, refreshController } from '../controllers/index.js';
import auth from "../middleware/auth.js"
import admin from "../middleware/admin.js"



// in order to register a new user
router.post("/register", registerController.register);

// user trying to login
router.post("/login", loginController.login);

// to fetch user data
router.get("/me", auth, userController.me);

// token generation
router.post("/refresh", refreshController.refresh);

// Logging out
router.post("/logout", auth, loginController.logout);

// Adding a new product
router.post("/products", auth, productController.store);

// Updating a product
router.put("/products/:id", [auth, admin], productController.update);

// Deleting a product
router.delete("/products/:id", [auth, admin], productController.destroy);


export default router;