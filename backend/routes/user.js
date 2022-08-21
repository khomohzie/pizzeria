const express = require("express");

const router = express.Router();

const { editProfile } = require("../controllers/user/user.controller");

const { requireSignin } = require("../middleware/auth.middleware");

router.post("");
router.get("");
router.put("/user/me", requireSignin, editProfile);

module.exports = router;
