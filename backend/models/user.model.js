const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		fullname: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			maxlength: 10,
		},
		contact: {
			type: String,
		},
		role: {
			type: Number,
			enum: [0, 1],
			default: 1,
		},
		reset_password_pin: {
			type: String,
			default: "",
		},
		reset_pin_expiry: {
			type: Date,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
