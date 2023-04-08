// the logic to allow a user to log in

import Joi from "joi";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import bcrypt from "bcrypt";
import JwtService from "../../services/Jwtservice";
import { REFRESH_SECRET } from "../../config/index.js";
import { User, RefreshToken } from "../../models/index.js";

const loginController = {
    async login(req, res, next){
        // creating a login schema
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
        });

        const { error } = loginSchema.validate(req.body);

        // in case any error arises
        if(error){
            return next(err);
        }

        // validating the credentials provided by the user
        try{
            const user = await User.findOne({email: req.body.email});
            // checking if the email exists in the database or not
            if(!user){
                return next(CustomErrorHandler.wrongCredentials());
            }

            // checking if the entered password is correct
            const match = await bcrypt.compare(req.body.password, user.password);
            if(!match){
                return next(CustomErrorHandler.wrongCredentials());
            }

            // generating a user token
            const access_token = JwtService.sign({_id: user._id, role: user.role});
            const refresh_token = JwtService.sign({_id: user._id, role: user.role}, '1y', REFRESH_SECRET);

            await RefreshToken.create({token: refresh_token});

            res.json({access_token, refresh_token});
        }
        catch(err){
            return next(err);
        }
    },

    // the logic to logout a user
    async logout(req, res, next){
        // validating the token enetered by the user!
        const refreshSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
        });

        const { error } = refreshSchema.validate(req.body);

        // in case any error arises
        if(error){
            return next(err);
        }

        // if the entered token is geniune the proceed to delete it
        try{
            await RefreshToken.deleteOne({token: req.body.refresh_token});
        }
        catch(err){
            return next(new Error("Something went wrong!"))
        }
        res.json({status: 200})
    }
}

export default loginController;