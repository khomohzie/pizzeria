//packages
import express from "express";

//helpers
import { logger } from "../../../helpers/logger.js";

//middlewares
// import isAuth from "../../middleware/isAuth.js";
// import isAdmin from "../../middleware/isAdmin.js";
// import isSuperAdmin from "../../middleware/isSuperAdmin.js";

//controller
import {
    adminSignIn,
    forgotPassword as _forgotPassword,
    resetPassword as _resetPassword,
} from "../../../controllers/admin/authController.js";

//validators
import {
    validateLogin,
    validateForgotPassword,
    validateResetPassword,
} from "../../../validations/admin/authValidators.js";

const router = express.Router();

//create admin
router.post("/sign_in", validateLogin, async (req, res, next) => {
    try {
        const signIn = await adminSignIn(req.body);

        return res.status(signIn.code).json(signIn);
    } catch (e) {
        logger.error("🔥 error: %o", e);
        next();
        return res.status(500).json({
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, admin could not sign in",
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
            message: "something went wrong, admin could not sign in",
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
            message: "something went wrong, admin could not sign in",
        });
    }
});

export default router;
