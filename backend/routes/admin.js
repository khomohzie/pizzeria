const express = require("express");

const router = express.Router();

const { deleteUser } = require("../controllers/admin/admin.controller");

const { requireSignin } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/isAdmin");

router.post("");
router.get("");
router.put("");
router.delete("/admin/delete", requireSignin, isAdmin, deleteUser);

module.exports = router;
