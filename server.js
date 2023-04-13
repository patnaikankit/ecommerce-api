import express from 'express';
const app = express();
import routes from './routes/index.js';
import { APP_PORT, DB_URL } from "./config/index.js";
import errorHandler from "./middleware/errorHandler.js";
import mongoose from 'mongoose';
import path from "path";

// Database connection
mongoose.set('strictQuery',false);
mongoose.connect("mongodb://0.0.0.0:27017/ecommerceDB");


// to register all the routes 
app.use("/api", routes);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(errorHandler);

global.appRoot;

// to let the browser to know it has to serve the images from uploads folder
app.use('/uploads', express.static('uploads'));

app.listen(process.env.APP_PORT, (req,res) => {
    console.log("Server is listening on port 4000!");
});