const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const referenceSchema = new mongoose.Schema(
	{
		referenceID: {
			type: String,
			trim: true,
			unique: true,
			required: [true, "A unique reference ID is required"],
		},
		pizza: {
			type: [ObjectId],
			ref: "Pizza",
		},
		amount: {
			type: Number,
			required: true,
		},
		purchaserEmail: {
			type: String,
			required: [true, "Purchaser's email is required"],
		},
		isSuccessful: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Reference", referenceSchema);
