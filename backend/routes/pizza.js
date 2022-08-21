const express = require("express");
const formidable = require("express-formidable-v2");

const router = express.Router();

const {
	createPizza,
	getPizza,
	getAllPizzas,
	editPizza,
	deletePizza,
} = require("../controllers/pizza.controller");

const { requireSignin } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/isAdmin");

router.post("/pizza", requireSignin, isAdmin, formidable(), createPizza);
router.get("/pizza/:id", getPizza);
router.get("/pizza", getAllPizzas);
router.put("/pizza/:id", requireSignin, isAdmin, formidable(), editPizza);
router.delete("/pizza/:id", requireSignin, isAdmin, deletePizza);

module.exports = router;
