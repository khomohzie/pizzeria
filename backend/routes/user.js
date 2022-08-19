const express = require("express");

const router = express.Router();

const { editProfile } = require("../controllers/user/user.controller");

router.post("");
router.get("");
router.put("/user/me/:id", editProfile);

module.exports = router;
