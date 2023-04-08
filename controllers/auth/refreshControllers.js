// the logic to generate a refresh token
import Joi from "joi";
import { RefreshToken } from "../../models/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import JwtService from "../../services/Jwtservice.js";
import { REFRESH_SECRET } from "../../config/index.js";
import { User } from "../../models/index.js";


const refreshController = {
    async refresh(req, res, next){
        // creating a refresh schema
        const refreshSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
        });

        const { error } = refreshSchema.validate(req.body);

        // in case any error arises
        if(error){
            return next(err);
        }

        // checking if the token already exists in the database
        let refresh_token;
        try{
            await RefreshToken.findOne({token: req.body.refresh_token});
            if(!refresh_token){
                return next(CustomErrorHandler.unAuthorized("Invalid Refresh Token"));
            }

            let userId;
            try{
                const { _id } = await JwtService.verify(refreshtoken.refresh, REFRESH_SECRET);
                userId = _id;
            }
            catch(err){
                return next(CustomErrorHandler.unAuthorized("Invalid Refresh Token"));
            }

            // checking if the user exists in the database or not
            const user = User.findOne({_id: userId});
            if(!user){
                return next(CustomErrorHandler.unAuthorized("User Not Found!"));
            }

             // generating the tokens after all the verification steps are done
             const access_token = JwtService.sign({_id: user._id, role: user.role});
             const refresh_token = JwtService.sign({_id: user._id, role: user.role}, '1y', REFRESH_SECRET);
 
             await RefreshToken.create({token: refresh_token});
 
             res.json({access_token, refresh_token});

        }
        catch(err){
            return next(new Error("Something went wrong" + err.message));
        }
    }
}

export default refreshController;