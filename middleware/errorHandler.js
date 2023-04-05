import { DEBUG_MODE } from "../config/index.js";
import pkg from 'joi';
import CustomErrorHandler from "../services/CustomErrorHandler.js";
const { ValidationError } = pkg;

const errorHandler = (err, req, res, next) => {
    // if an error occurs status code and a message will be sent 
    let statusCode = 500;
    let data = {
        // for sending server side of the error
        message: 'Internal Server Error',

        ...(DEBUG_MODE == 'true' && {originalError: err.message})
    }
    // if the error is of the class error received from above middleware
    if(err instanceof pkg){
        statusCode = 422,
        data = {
            message: err.message
        }
    }

    // error message thrown if email is already registered
    if(err instanceof CustomErrorHandler){
        statusCode = err.status,
        data = {
            message: err.message
        }
    }

    return res.status(statusCode).json(data);
}

export default errorHandler;