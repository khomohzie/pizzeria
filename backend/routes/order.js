const express = require("express");

const router = express.Router();

const {
	createOrder,
	verifyOrder,
	getAllOrders,
	getMyOrders,
	getOrder,
} = require("../controllers/order.controller");

const { requireSignin } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/isAdmin");

router.post("/order/pay/pizza/:id", requireSignin, createOrder);
router.get("/order/paystack/verify-transaction", requireSignin, verifyOrder);
router.get("/order/all", requireSignin, isAdmin, getAllOrders);
router.get("/order", requireSignin, getMyOrders);
router.get("/order/:id", requireSignin, getOrder);

module.exports = router;
