// the logic to allow a user to log in

import Joi from "joi";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import bcrypt from "bcrypt";
import JwtService from "../../services/Jwtservice";

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
            access_token = JwtService.sign({_id: user._id, role: user.role});

            res.json({access_token})
        }
        catch(err){
            return next(err);
        }
    }
}

export default loginController;