const express = require("express");
const formidable = require("express-formidable-v2");

const router = express.Router();

const {
	createPizza,
	getPizza,
	getAllPizzas,
} = require("../controllers/pizza.controller");

const { requireSignin } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/isAdmin");

router.post("/pizza", requireSignin, isAdmin, formidable(), createPizza);
router.get("/pizza/:id", getPizza);
router.get("/pizza", getAllPizzas);
router.put("");

module.exports = router;
