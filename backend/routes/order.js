const express = require("express");

const router = express.Router();

const { createOrder, verifyOrder } = require("../controllers/order.controller");

const { requireSignin } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/isAdmin");

router.post("/order/pay/pizza/:id", requireSignin, createOrder);
router.get("/order/paystack/verify-transaction", requireSignin, verifyOrder);
router.get("");
router.put("");

module.exports = router;
