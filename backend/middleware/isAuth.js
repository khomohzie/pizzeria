import { tokenVerifier } from "../../helpers/jwtHelper.js";
import mongodb from "mongodb";

/// Make sure you cross check this and set it up to your style and how you use JWT
const isAuth = async (req, res, next) => {
    const { ObjectID } = mongodb;
    const authHeader = req.headers.authorization;

    if ((authHeader && authHeader.split(" ")[0] === "Token") || (authHeader && authHeader.split(" ")[0] === "Bearer")) {
        const token = authHeader.split(" ")[1];
        try {
            let decodedToken = await tokenVerifier(token);

            if (!decodedToken._id) {
                return res.status(401).json({
                    error: "true",
                    message: "token expired",
                });
            }

            decodedToken._id = ObjectID(`${decodedToken._id}`);

            req.currentUser = decodedToken;
            next();
        } catch (error) {
            return res.status(401).json({
                error: "true",
                message: "Invalid authorization header",
            });
        }
    } else {
        return res.status(401).json({
            error: "true",
            message: "Access denied! No token provided",
        });
    }
};

export default isAuth;
