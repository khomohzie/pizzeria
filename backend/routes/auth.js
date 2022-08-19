const express = require("express");

const router = express.Router();

const { createUser } = require("../controllers/user/auth.controller");
const { createAdmin } = require("../controllers/admin/auth.controller");

router.post("/user/auth/signup", createUser);
router.post("/admin/auth/signup", createAdmin);
router.get("");
router.put("");

module.exports = router;
