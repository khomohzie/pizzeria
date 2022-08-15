//packages
import express from "express";
import { logger } from "../../../helpers/logger.js";

//middlewares
import isAuth from "../../middleware/isAuth.js";
import isAdmin from "../../middleware/isAdmin.js";
import isSuperAdmin from "../../middleware/isSuperAdmin.js";

//controller
import {
    createAdmin as _createAdmin,
    updatePassword as _updatePassword,
    currentAdmin as _currentAdmin,
    getAllAdmins as _getAllAdmins,
    toggleAdmins as _toggleAdmins,
} from "../../../controllers/admin/adminController.js";

// validations
import { validateCreateAdmin, validateUpdatePassword } from "../../../validations/admin/adminValidators.js";

const router = express.Router();

//create admin
router.post("/create_admin", validateCreateAdmin, isAuth, isSuperAdmin, async (req, res, next) => {
    try {
        const createAdmin = await _createAdmin(req.body, req.currentUser._id);

        return res.status(createAdmin.code).json(createAdmin);
    } catch (e) {
        logger.error("🔥 error: %o", e);
        next();
        return res.status(500).json({
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, could not create admin",
        });
    }
});

//update password
router.post("/update_password", validateUpdatePassword, isAuth, isAdmin, async (req, res, next) => {
    try {
        const updatePassword = await _updatePassword(req.body, req.currentUser._id);

        return res.status(updatePassword.code).json(updatePassword);
    } catch (e) {
        logger.error("🔥 error: %o", e);
        next();
        return res.status(500).json({
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, could not change password",
        });
    }
});

//get current admin
router.get("/me", [isAuth, isAdmin], async (req, res, next) => {
    try {
        const currentAdmin = await _currentAdmin(req.currentUser._id);

        return res.status(currentAdmin.code).json(currentAdmin);
    } catch (e) {
        logger.error("🔥 error: %o", e);
        next();
        return res.status(500).json({
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, could not get current admin",
        });
    }
});

//get all admins
router.get("/get_all_admins", [isAuth, isAdmin], async (req, res, next) => {
    try {
        const getAllAdmins = await _getAllAdmins();

        return res.status(getAllAdmins.code).json(getAllAdmins);
    } catch (e) {
        logger.error("🔥 error: %o", e);
        next();
        return res.status(500).json({
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, could not get all admins",
        });
    }
});

//deactivate an admin
router.patch("/toggle_admin/:id", isAuth, isSuperAdmin, async (req, res, next) => {
    try {
        const toggleAdmins = await _toggleAdmins(req.params.id);

        return res.status(toggleAdmins.code).json(toggleAdmins);
    } catch (e) {
        logger.error("🔥 error: %o", e);
        next();
        return res.status(500).json({
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, could not deactivate admins",
        });
    }
});

export default router;
