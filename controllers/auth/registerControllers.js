// the logic to register a new user

import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import { RefreshToken, User } from "../../models/index.js"
import bcrypt from "bcrypt";
import JwtService from "../../services/Jwtservice.js";
import { REFRESH_SECRET } from "../../config/index.js";

// using Joi library for all the validation involved in the system
import Joi from 'joi';


const registerController = {
    async register(req, res, next){
        // Validation
        // user credentials will be checked
        // creating a register schema
        const registrationSchema = Joi.object({
            name: Joi.string().min(5).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
            confirm_password: Joi.ref('password')
        });

        const { error } = registrationSchema.validate(req.body);

        if(error){
            // next is used so that the middleware can detect the error
            return next(error);
        }

        // if email already exists
        try{
            const exist = await User.exists({ email: req.body.email });
            if(exist){
                return next(CustomErrorHandler.alreadyExist("This email is already taken!"));
            }
        }
        catch(err){
            return next(err);
        }

        // Securing the password with bcrypt
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const { name, email } = req.body; // Extract name and email from req.body

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        let access_token, refresh_token;

        // saving data of new users in the database 
        try{
            const result = await user.save(); // Save the user object instead of User.save()

            // Token generation

            // at the time of login - access_token has a short expiry time
            access_token = JwtService.sign({_id: result._id, role: result.role});
            // generated at the time of login but will come in effect after access_token expires 
            refresh_token = JwtService.sign({_id: result._id, role: result.role}, '1y', REFRESH_SECRET);

            // database whitelist - saving it in the database so that in case the token is compromised data can't be manipulated
            await RefreshToken.create({token: refresh_token});
        }
        catch(err){
            return next(err);
        }

        res.json({access_token, refresh_token});
    }
}

export default registerController;
