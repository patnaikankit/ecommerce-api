import { JWT_SECRET } from "../config/index.js";
import pkg from 'jsonwebtoken';
const { Jwt } = pkg;

// Creating a jwt token which will to be sent to the client
class JwtService{
    // created at the time of reistering or logging in
    static sign(payload, expiry = '60s', secret = JWT_SECRET){
        return Jwt.sign(payload, secret, { expiresIn: expiry });
    }

    // verifying if the generated token is valid or not
    static verify(token,  secret = JWT_SECRET){
        return Jwt.verify(token, secret);
    }
}

export default JwtService;