import mongoose from "mongoose";
import { APP_URL } from "../config/index.js";


const productSchema = new mongoose.Schema({
    // product schema 
    name: {type: String, required: true},
    price: {type: Number, required: true},
    size: {type: String, required: true},
    image: {type: String, required: true, get: (image) => {
        // to get complete path of the stored file
        return `${APP_URL}/${image}`;
    }}
}, {timestamps: true, toJSON: {getters: true}, id: false})

export default mongoose.model('Product', productSchema, 'products')