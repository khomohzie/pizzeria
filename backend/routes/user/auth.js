import express from "express";
import { logger } from "../../../helpers/logger.js";

import isAuth from "../../middleware/isAuth.js";

import {
    userSignIn,
    forgotPassword as _forgotPassword,
    resetPassword as _resetPassword,
    resetPin as _resetPin,
    verifyPin as _verifyPin,
} from "../../../controllers/user/authController.js";

//validators
import {
    validateLogin,
    validateForgotPassword,
    validateResetPassword,
} from "../../../validations/user/authValidators.js";

const router = express.Router();

//sign in
router.post("/sign_in", validateLogin, async (req, res, next) => {
    try {
        const login = await userSignIn(req.body);

        return res.status(login.code).json(login);
    } catch (e) {
        logger.error("🔥 error: %o", e);
        next();
        return res.status(500).json({
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, user could not sign in",
        });
    }
});

//forgot password
router.post("/forgot_password", validateForgotPassword, async (req, res, next) => {
    try {
        const forgotPassword = await _forgotPassword(req.body);

        return res.status(forgotPassword.code).json(forgotPassword);
    } catch (e) {
        logger.error("🔥 error: %o", e);
        next();
        return res.status(500).json({
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, could not send forgot password mail",
        });
    }
});

//reset password
router.post("/reset_password", validateResetPassword, async (req, res, next) => {
    try {
        const resetPassword = await _resetPassword(req.body);

        return res.status(resetPassword.code).json(resetPassword);
    } catch (e) {
        logger.error("🔥 error: %o", e);
        next();
        return res.status(500).json({
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, could not reset password",
        });
    }
});

//reset pin
router.post("/reset_pin", async (req, res, next) => {
    try {
        const resetPin = await _resetPin(req.body);

        return res.status(resetPin.code).json(resetPin);
    } catch (e) {
        logger.error("🔥 error: %o", e);
        next();
        return res.status(500).json({
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, could not reset pin",
        });
    }
});

// verify pin
router.post("/verify_pin", isAuth, async (req, res, next) => {
    try {
        const verifyPin = await _verifyPin(req.body, req.currentUser._id);

        return res.status(verifyPin.code).json(verifyPin);
    } catch (e) {
        logger.error("🔥 error: %o", e);
        next();
        return res.status(500).json({
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, could not verify pin",
        });
    }
});

export default router;
