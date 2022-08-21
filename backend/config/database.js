const mongoose = require("mongoose");

const uri =
	process.env.NODE_ENV === "development"
		? process.env.MONGO_URI
		: process.env.MONGO_URI_CLOUD;

exports.connectDB = async () => {
	await mongoose
		.connect(uri)
		.then(() => {
			console.log("DB connection successful!");
		})
		.catch((err) => {
			console.log(err);
			throw err;
		});
};

exports.close = () => {
	return mongoose.disconnect();
};
