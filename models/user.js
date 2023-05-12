import pkg from 'joi';
const { string, object } = pkg;
import mongoose from "mongoose";
import validator from 'validator';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      validate: {
        validator: (value) => string().min(5).max(30).validate(value).error === undefined,
        message: "Name must be between 5 and 30 characters long."
      }
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value) => string().email().validate(value).error === undefined,
        message: "Invalid email format."
      }
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: (value) => string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).validate(value).error === undefined,
        message: "Password must be alphanumeric and between 5 and 30 characters long."
      }
    },
    role: {
      type: String,
      default: "customer"
    }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema, 'users');
