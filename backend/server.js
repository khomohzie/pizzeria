import app from "./app.js";
import { connectDB, close } from "./config/database.js";
import { exit } from "process";

const PORT = process.env.PORT || 8000;

let server;

connectDB()
	.then(() => {
		server = app.listen(PORT, () => {
			console.log(`Server listening on port: ${PORT}`);
		});
	})
	.catch((error) => {
		console.log("Database connection failed! \n", error);
	});

process.on("unhandledRejection", (err) => {
	console.log("UNHANDLED REJECTION! 💥 Shutting down... 😭😭😭");
	console.log(err);
	console.log(err.name, err.message);

	server.close(() => {
		close();
		exit(1);
	});
});
