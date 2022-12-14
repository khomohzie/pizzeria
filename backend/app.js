require("dotenv").config({ path: "config.env" });
const express = require("express");
const morgan = require("morgan");
const { readdirSync } = require("fs");

const { json, urlencoded } = express;

const app = express();

// parse application/json
app.use(json());
// parse application/x-www-form-urlencoded
app.use(urlencoded({ extended: true }));
// setup the logger
app.use(morgan("dev"));

process.on("uncaughtException", (err) => {
	// eslint-disable-next-line no-console
	console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
	// eslint-disable-next-line no-console
	console.log(err);
	console.log(err.name, err.message);
	process.exit(1);
});

//Allow all requests from all domains & localhost
app.all("/*", function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"X-Requested-With, Content-Type, Accept, Authorization"
	);
	res.header("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, DELETE");
	next();
});

app.get("/", (req, res) => {
	res.send("Server works");
});

//* Routes
readdirSync("./routes").map((route) => {
	app.use("/api", require(`./routes/${route}`));
});

module.exports = app;
