import { User } from "../models"
import CustomErrorHandler from "../services/CustomErrorHandler.js";

// to make sure that admin can only make changes in product
const admin = async (req, res, next) => {
    try{
        const user = await User.findOne({_id: req.user._id});
        if(user.role === 'admin'){
            next();
        }
        else{
            return next(CustomErrorHandler.unAuthorized());
        }
    }
    catch(err){
        return next(CustomErrorHandler.serverError());
    }
}