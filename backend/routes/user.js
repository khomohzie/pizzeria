const express = require("express");

const router = express.Router();

const {
	userProfile,
	editProfile,
	changePassword,
	deleteAccount,
	favoritePizza,
	getFavorites,
	deleteFavorites,
} = require("../controllers/user/user.controller");

const { requireSignin } = require("../middleware/auth.middleware");

router.get("/user/me", requireSignin, userProfile);
router.put("/user/me", requireSignin, editProfile);
router.put("/user/me/password", requireSignin, changePassword);
router.delete("/user/me", requireSignin, deleteAccount);

//* Favorites
router.post("/favorite", requireSignin, favoritePizza);
router.get("/favorite", requireSignin, getFavorites);
router.delete("/favorite", requireSignin, deleteFavorites);

module.exports = router;
