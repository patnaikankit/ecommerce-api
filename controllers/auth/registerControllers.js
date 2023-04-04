// the logic to register a new user

// using joi library for all the validation process
const joi = require("joi");

const registerController = {
    async register(req, res, next){


        // Validation
        const registrationSchema = joi.object({
            name: joi.string().min(5).max(30).required(),
            email: joi.string().email().required(),
            password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
            confirm_password: joi.ref('password')
        });

        const { error } = registrationSchema.validate(req.body);

        if(error){
            return next(error);
        }
        // res.json({msg: "Hello"})
    }
}

module.exports = registerController;