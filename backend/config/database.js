import mongoose from "mongoose";

const uri =
	process.env.NODE_ENV === "development"
		? process.env.MONGO_URI
		: process.env.MONGO_URI_CLOUD;

export const connectDB = async () => {
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

export function close() {
	return mongoose.disconnect();
}
