import pkg from 'joi';
const { string } = pkg;
import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    // validating on a database level if the name is provided or not
    name: {type: string, required: true},
    email: {type: string, required: true, unique: true},
    password: {type: string, required: true},
    role: {type: string, default: "customers"}
}, {timestamps: true})

export default mongoose.model('User', userSchema, 'customers')