import { JWT_SECRET } from "../config";
import { Jwt } from "jsonwebtoken";

// Creating a jwt token which will to be sent to the client
class JwtService{
    static sign(payload, expiry = '60s', secret = JWT_SECRET){
        return Jwt.sign(payload, secret, { expiresIn: expiry });
    }
}

export default JwtService;