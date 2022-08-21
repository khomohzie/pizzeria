const express = require("express");

const router = express.Router();

const {
	userProfile,
	editProfile,
	deleteAccount,
} = require("../controllers/user/user.controller");

const { requireSignin } = require("../middleware/auth.middleware");

router.post("");
router.get("/user/me", requireSignin, userProfile);
router.put("/user/me", requireSignin, editProfile);
router.delete("/user/me", requireSignin, deleteAccount);

module.exports = router;
