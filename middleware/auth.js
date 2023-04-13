import CustomErrorHandler from "../services/CustomErrorHandler.js";
import JwtService from "../services/Jwtservice.js";

// middleware to make sure that the data is provided only after the login credentials are validated

const auth = async (req, res, next) => {
    // requesting data from the header part
    let authHeader = req.headers.authorization;

    // in case we don't access to the authorization
    if(!authHeader){
        return next(CustomErrorHandler.unAuthorized());
    }

    const token = authHeader.spilt(' ')[1];

    try{
        // verification call
        const {_id, role} = await JwtService.verify(token);
        const user = {
            _id,
            role
        }
        req.user = user;
        next();
    }
    catch(err){
        return next(CustomErrorHandler.unAuthorized());
    }
}

export default auth;