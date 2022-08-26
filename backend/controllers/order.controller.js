const Order = require("../services/order.service");
const CustomResponse = require("../utils/response.util");

const paystack = require("paystack-api")(process.env.PAYSTACK_SECRET);

const order = new Order();

exports.createOrder = async (req, res) => {
	try {
		const { pizzas, total } = req.body;

		const [status, data] = await order.addOrder(
			req.user._id,
			pizzas,
			total
		);

		if (!status) {
			return new CustomResponse(res, true).error(
				"Unable to initialize payment",
				data,
				400
			);
		}

		paystack.transaction
			.initialize({
				reference: data.referenceID,
				amount: data.amount,
				email: data.purchaserEmail,
				callback_url: `${process.env.CLIENT_URL}/verify-transaction.html`,
			})
			.then(function (response, body) {
				if (response.status) {
					return new CustomResponse(res).success(
						"Paystack payment initialization successful",
						{
							paystackUrl: response.data.authorization_url,
							reference: response.data.reference,
						},
						201
					);
				}

				return new CustomResponse(res, true).error(
					"Paystack payment initialization unsuccessful",
					{},
					400
				);
			})
			.catch((err) => {
				return new CustomResponse(res, err).error(
					"PayStack payment error",
					{},
					503
				);
			});
	} catch (error) {
		console.log(error);
		return new CustomResponse(res, error).error(
			"Something went wrong",
			error,
			500
		);
	}
};

exports.verifyOrder = async (req, res) => {
	try {
		const [status, data] = await order.verifyTransaction(
			req.query.reference
		);

		if (!status) {
			return new CustomResponse(res, true).error(
				"Order failed! Please try again",
				data,
				400
			);
		}

		return new CustomResponse(res).success(
			"Order created and confirmed!",
			data,
			200
		);
	} catch (error) {
		console.log(error);
		return new CustomResponse(res, error).error(
			"Something went wrong",
			error,
			500
		);
	}
};

exports.getAllOrders = async (req, res) => {
	try {
		const [status, data] = await order.getAllOrders();

		if (!status) {
			return new CustomResponse(res, true).error(
				"Unable to retrieve orders",
				data,
				500
			);
		}

		if (data.length <= 0) {
			return new CustomResponse(res).success("No orders yet!", data, 200);
		}

		return new CustomResponse(res).success(
			"All orders retrieved",
			data,
			200
		);
	} catch (error) {
		console.log(error);
		return new CustomResponse(res, error).error(
			"Something went wrong",
			error,
			500
		);
	}
};

exports.getMyOrders = async (req, res) => {
	try {
		const [status, data] = await order.getMyOrders(req.user._id);

		if (!status) {
			return new CustomResponse(res, true).error(
				"Unable to retrieve orders",
				data,
				500
			);
		}

		if (data.length <= 0) {
			return new CustomResponse(res).success("No orders yet!", data, 200);
		}

		return new CustomResponse(res).success(
			"All orders retrieved",
			data,
			200
		);
	} catch (error) {
		console.log(error);
		return new CustomResponse(res, error).error(
			"Something went wrong",
			error,
			500
		);
	}
};

exports.getOrder = async (req, res) => {
	try {
		const [status, data] = await order.getOrder(req.params.id);

		if (!status) {
			return new CustomResponse(res, true).error(
				"Unable to retrieve order",
				data,
				500
			);
		}

		return new CustomResponse(res).success(
			"Order data retrieved",
			data,
			200
		);
	} catch (error) {
		console.log(error);
		return new CustomResponse(res, error).error(
			"Something went wrong",
			error,
			500
		);
	}
};
