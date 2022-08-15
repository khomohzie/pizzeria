import express from "express";
import { logger } from "../../../helpers/logger.js";

import isAuth from "../../middleware/isAuth.js";

import { userSignUp, updateUser, currentUser } from "../../../controllers/user/userController.js";

const router = express.Router();

//sign up
router.post("/sign_up", async (req, res, next) => {
    try {
        const createUser = await userSignUp(req.body);

        return res.status(createUser.code).json(createUser);
    } catch (e) {
        logger.error("🔥 error: %o", e);
        next();
        return res.status(500).json({
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, user could not sign up",
        });
    }
});

router.patch("/update_user/", isAuth, async (req, res, next) => {
    try {
        const updateUserDetails = await updateUser(req.body, req.currentUser._id);

        return res.status(updateUserDetails.code).json(updateUserDetails);
    } catch (e) {
        logger.error("🔥 error: %o", e);
        next();
        return res.status(500).json({
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, could not update user",
        });
    }
});

// //get current user
router.get("/me", isAuth, async (req, res, next) => {
    try {
        const getUserDetails = await currentUser(req.currentUser._id);

        return res.status(getUserDetails.code).json(getUserDetails);
    } catch (e) {
        logger.error("🔥 error: %o", e);
        next();
        return res.status(500).json({
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, could not get user's details",
        });
    }
});

export default router;
