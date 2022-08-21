const mongoose = require("mongoose");

const pizzaSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			maxlength: 80,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			default: "/pizza.png",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Pizza", pizzaSchema);
