const express = require("express");

const router = express.Router();

const { createUser, signin } = require("../controllers/user/auth.controller");
const { createAdmin } = require("../controllers/admin/auth.controller");

router.post("/user/auth/signup", createUser);
router.post("/admin/auth/signup", createAdmin);
router.post("/user/auth/signin", signin);
router.get("");
router.put("");

module.exports = router;
