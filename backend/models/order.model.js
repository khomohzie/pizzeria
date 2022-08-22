const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const orderSchema = new mongoose.Schema(
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
		amount: {
			type: Number,
			required: true,
		},
		reference: {
			type: ObjectId,
			ref: "Reference",
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
