//helpers
import { logger } from "../../helpers/logger.js";
import { hash } from "../../helpers/helpers.js";

import { generateJwtToken } from "../../helpers/jwtHelper.js";

//model
import User from "../../models/user.js";

export async function userSignUp(data) {
    logger.debug("Creating a new user");
    try {
        const userAvailable = User.findOne({ email: data.email });

        if (userAvailable) {
            return {
                code: 409,
                status: "conflict",
                error: true,
                message: "User already Exists",
            };
        }
        //hash password
        data.password = await hash(data.password.toString());

        const user = await User.create({
            ...data,
        });

        await user.save();

        const token = await generateJwtToken(user);

        //welcome mail

        return {
            code: 201,
            status: "success",
            error: false,
            message: "User created successfully",
            data: {
                token: token,
                user: user,
            },
        };
    } catch (e) {
        logger.error("🔥 error: %o", e);
        return {
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, could not create user",
        };
    }
}

export async function updateUser(data, id) {
    logger.debug("update a user...");
    try {
        //list all the updatable fields for user

        //update user
        let user = await User.findByIdAndUpdate(id, ...data, {
            new: true,
        }).lean();

        if (user == null) {
            return {
                status_code: 400,
                message: "User does not exist",
            };
        }

        return {
            code: 200,
            status: "success",
            error: false,
            message: "user updated successfully",
            data: user,
        };
    } catch (e) {
        logger.error("🔥 error: %o", e);
        return {
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, could not update user",
        };
    }
}

//get current user
export async function currentUser(id) {
    try {
        logger.debug("Getting current user");

        //get the details of the user currently logged in by passing the id in the token
        const user = await User.findById(id);

        return {
            code: 200,
            status: "success",
            error: false,
            message: "User retrieved successfully",
            data: user,
        };
    } catch (e) {
        logger.error("🔥 error: %o", e);
        return {
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, could not get user's details",
        };
    }
}

//create transaction pin
export async function createPin(data, userId) {
    try {
        logger.debug("Creating user pin");
        const user = await User.findById(userId);
        const hashed_pin = await hash(data.pin);

        if (user.is_pin_set) {
            return {
                code: 400,
                status: "failed",
                error: true,
                message: "Your pin has been set before",
            };
        }

        await User.findByIdAndUpdate(userId, {
            pin: hashed_pin,
            is_pin_set: true,
        });
        return {
            code: 200,
            status: "success",
            error: false,
            message: "user pin created successfully",
        };
    } catch (e) {
        logger.error("🔥 error: %o", e);
        return {
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, could not create transaction pin",
        };
    }
}

//-----Helpers for this controller----

// check if a unique field exists
export async function checkExists(param, attribute) {
    const query =
        attribute == "username" ? { username: param } : attribute == "phone" ? { phone: param } : { email: param };
    return await User.findOne(query);
}

//verify pin (in-Api usage)
export async function verifyUserPin(user_id, pin, res) {
    logger.debug("Verifying user pin...");

    const user = await User.findById(user_id).select("+pin");
    if (!user)
        return res.status(401).send({
            error: true,
            message: "User does not exist",
        });
    const verify_pin = await this.verifyHash(pin, user.pin);

    if (!verify_pin) {
        return res
            .status(401)
            .send({
                error: true,
                message: "Incorrect pin",
            })
            .end();
    }

    return verify_pin;
}
