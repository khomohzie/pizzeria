const express = require("express");
const { editProfile } = require("../controllers/admin/admin.controller");

const router = express.Router();

router.post("");
router.get("");
router.put("/admin/me/:id", editProfile);

module.exports = router;
