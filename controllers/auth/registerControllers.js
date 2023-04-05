// the logic to register a new user

import CustomErrorHandler from "../../services/CustomErrorHandler";
import { User } from "../../models/index.js"
import bcrypt from "bcrypt";
import JwtService from "../../services/Jwtservice";

// using joi library for all the validating data provided by the user
const joi = require("joi");


const registerController = {
    async register(req, res, next){


        // Validation
        // user credentials will be checked
        const registrationSchema = joi.object({
            name: joi.string().min(5).max(30).required(),
            email: joi.string().email().required(),
            password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
            confirm_password: joi.ref('password')
        });

        const { error } = registrationSchema.validate(req.body);

        if(error){
            // next is used so that the middleware can detect the error
            return next(error);
        }

        // if email already exists
        try{
            const exist = await User.exist({email: req.body.email});
            if(exist){
                return next(CustomErrorHandler.alreadyExist("This email is laready taken!"));
            }
        }
        catch(err){
            return next(err);
        }

        // Securing the password with brypt
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        let access_token;
        // saving data of new users in the database 
        try{
            const result = await User.save();

            // Token geneartion
            access_token = JwtService.sign({_id: result._id, role: result.role});
        }
        catch(err){
            return next(err);
        }

        res.json({access_token: access_token})
    }
}

export default registerController;


