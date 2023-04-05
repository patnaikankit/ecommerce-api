import express from 'express';
const app = express();
import routes from './routes/index.js';
import { APP_PORT, DB_URL } from "./config/index.js";
import errorHandler from "./middleware/errorHandler.js";
import mongoose from 'mongoose';

// Database connection
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DB connected...');
});


// to register all the routes 
app.use("/api", routes);

app.use(express.json());

app.use(errorHandler);

app.listen(process.env.APP_PORT, (req,res) => {
    console.log("Server is listening on port 3000!");
});