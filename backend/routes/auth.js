const express = require("express");

const router = express.Router();

const {
	createUser,
	signin,
	forgotPassword,
	resetPassword,
} = require("../controllers/user/auth.controller");
const { createAdmin } = require("../controllers/admin/auth.controller");

router.post("/user/auth/signup", createUser);
router.post("/admin/auth/signup", createAdmin);
router.post("/auth/signin", signin);
router.post("/auth/forgot_password", forgotPassword);
router.put("/auth/reset_password", resetPassword);
router.put("");

module.exports = router;
