import pkg from 'joi';
const { string } = pkg;
import mongoose from "mongoose";


const refreshTokenSchema = new mongoose.Schema({
    // generation of token so that user is logged in after access_token expires
    token: {type: String, unique: true}, 
}, {timestamps: true})

export default mongoose.model('RefreshToken', refreshTokenSchema, 'refreshTokens')