const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const favoriteSchema = new mongoose.Schema(
	{
		user: {
			type: ObjectId,
			ref: "User",
			required: true,
		},
		pizza: {
			type: ObjectId,
			ref: "Pizza",
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Favorite", favoriteSchema);
