import pkg from 'joi';
const { string } = pkg;
import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    // validating on a database level if the name is provided or not
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, default: "customer"}
}, {timestamps: true})

export default mongoose.model('User', userSchema, 'users')