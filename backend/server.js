const app = require("./app.js");
const { connectDB, close } = require("./config/database.js");
const { exit } = require("process");

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
