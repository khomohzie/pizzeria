const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const CustomResponse = require("../utils/response.util");

exports.requireSignin = async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (
		(authHeader && authHeader.split(" ")[0] === "Token") ||
		(authHeader && authHeader.split(" ")[0] === "Bearer")
	) {
		const token = authHeader.split(" ")[1];

		try {
			const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

			if (!decodedToken._id) {
				return new CustomResponse(res, true).error(
					"Token expired",
					{},
					401
				);
			}

			const userExists = await User.findById(decodedToken._id).exec();

			if (userExists) {
				req.user = decodedToken;
				next();
			} else {
				return new CustomResponse(res, true).error(
					"User does not exist! Please signup.",
					{},
					401
				);
			}
		} catch (error) {
			return new CustomResponse(res, true).error(
				"Invalid authorization header",
				{},
				401
			);
		}
	} else {
		return new CustomResponse(res, true).error(
			"Access denied! No token provided",
			{},
			401
		);
	}
};
