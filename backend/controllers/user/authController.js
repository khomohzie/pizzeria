import { logger } from "../../helpers/logger.js";

import User from "../../models/user.js";

import { verifyHash, hash, addMinutes, getCurrentTimestamp } from "../../helpers/helpers.js";

import { generateJwtToken } from "../../helpers/jwtHelper.js";

export async function userSignIn(data) {
    try {
        logger.debug("User is signing in...");

        const user = await checkExists(data.email, "email");
        if (!user) {
            return {
                code: 401,
                status: "failed",
                error: true,
                message: "User does not exist on this platform",
            };
        }

        //compare password
        const validPassword = await verifyHash(data.password, user.password);

        if (validPassword) {
            //remove password and pin field from response
            Reflect.deleteProperty(user._doc, "password pin");

            const token = await generateJwtToken(user);

            return {
                code: 200,
                status: "success",
                error: false,
                message: "User signed in successfully",
                data: {
                    token,
                    user,
                },
            };
        } else {
            return {
                code: 401,
                status: "failed",
                error: true,
                message: "Incorrect Email or password",
            };
        }
    } catch (e) {
        logger.error("🔥 error: %o", e);
        return {
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, user could not sign in",
        };
    }
}

export async function forgotPassword(data) {
    logger.debug("requesting reset token..");
    try {
        //check if user exists
        const user = await checkExists(data.email, "email");
        if (!user) {
            return {
                code: 401,
                status: "failed",
                error: true,
                message: "User does not exist on this platform",
            };
        }

        const token = Math.floor(100000 + Math.random() * 900000);

        const hashToken = await hash(token.toString());

        const tokenExpiry = addMinutes(new Date(), 4);

        await User.findByIdAndUpdate(user._id, {
            password_reset_token: hashToken,
            password_reset_expires: tokenExpiry,
        });

        //continue from here, finish this function check saturn node js for ref

        //send a mail here

        return {
            code: 200,
            status: "success",
            error: false,
            message: "reset token sent",
        };
    } catch (e) {
        logger.error("🔥 error: %o", e);
        return {
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, could not send reset token",
        };
    }
}

export async function resetPassword(data) {
    logger.debug("User is resetting password");

    try {
        //check if user exists
        const user = await User.findOne({
            email: data.email,
        }).select("+password_reset_token");
        if (!user) {
            return {
                code: 401,
                status: "failed",
                error: true,
                message: "User does not exist on this platform",
            };
        }

        //compare token
        const verifyToken = await verifyHash(data.token, user.password_reset_token);

        if (!verifyToken) {
            return {
                code: 401,
                status: "failed",
                error: true,
                message: "Incorrect token",
            };
        }

        const currentDate = getCurrentTimestamp();

        //check if token has expired
        if (currentDate > user.password_reset_expires) {
            return {
                code: 401,
                status: "failed",
                error: true,
                message: "Token is already expired",
            };
        }

        const password = await hash(data.password.toString());

        await User.findByIdAndUpdate(user._id, {
            password: password,
            password_changed_at: currentDate,
        });

        return {
            code: 200,
            status: "success",
            error: false,
            message: "password updated successfully",
        };
    } catch (e) {
        logger.error("🔥 error: %o", e);
        return {
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, could not reset password",
        };
    }
}

//reset pin
export async function resetPin(data) {
    try {
        logger.debug("User is resetting pin...");

        const user = await checkExists(data.email, "email");

        if (!user)
            return {
                code: 401,
                status: "failed",
                error: true,
                message: "User does not exist",
            };

        //compare token
        const verifyToken = await verifyHash(data.token, user.password_reset_token);

        if (!verifyToken) {
            return {
                code: 401,
                status: "failed",
                error: true,
                message: "Incorrect token",
            };
        }

        const currentDate = getCurrentTimestamp();

        //check if token has expired
        if (currentDate > user.password_reset_expires) {
            return {
                code: 401,
                status: "failed",
                error: true,
                message: "Token is already expired",
            };
        }

        const pin = await hash(data.pin.toString());

        await User.findByIdAndUpdate(user._id, {
            pin: pin,
        });

        return {
            code: 200,
            status: "success",
            error: false,
            message: "Pin updated successfully",
        };
    } catch (e) {
        logger.error("🔥 error: %o", e);
        return {
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, could not reset pin",
        };
    }
}

//verify pin
export async function verifyPin(data, userId) {
    try {
        logger.debug("Verifying user pin...");

        const user = await User.findById(userId);
        if (!user) {
            return {
                code: 401,
                status: "failed",
                error: true,
                message: "User does not exist",
            };
        }

        const verifyPin = await verifyHash(data.pin, user.pin);

        if (!verifyPin) {
            return {
                code: 500,
                status: "failed",
                error: true,
                message: "Incorrect pin",
            };
        }

        return {
            code: 200,
            status: "success",
            error: false,
            message: "pin is correct",
        };
    } catch (e) {
        logger.error("🔥 error: %o", e);
        return {
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, could not verify password",
        };
    }
}

//-----Helpers for this controller----
// check if a unique field exists
export async function checkExists(param, attribute) {
    const query =
        attribute == "username" ? { username: param } : attribute == "phone" ? { phone: param } : { email: param };
    return await User.findOne(query).select("+password +pin");
}
