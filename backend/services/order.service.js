const Reference = require("../models/reference.model");
const User = require("../models/user.model");
const orderModel = require("../models/order.model");
const pizzaModel = require("../models/pizza.model");
const { translateError } = require("../utils/mongo_helper");
const Common = require("./common.service");

const paystack = require("paystack-api")(process.env.PAYSTACK_SECRET);
const { v4: uuidv4 } = require("uuid");

class Order extends Common {
	constructor(order) {
		super(order);

		this.data = order;
	}

	#order;

	async addOrder(userId, pizzaId) {
		// Check if pizza is in database
		const pizza = await this.getById(pizzaModel, pizzaId);
		if (!pizza) return [false, "Pizza does not exist"];

		const user = await this.getById(User, userId);
		if (!user) return [false, "User does not exist"];

		const [status, reference] = await this.#createReference({
			referenceID: uuidv4(),
			pizza: pizza._id,
			amount: pizza.price * 100,
			purchaserEmail: user.email,
		});

		if (!status) return [false, reference];

		return [true, reference];
	}

	async verifyTransaction(reference) {
		const verifyRef = await paystack.transaction.verify({ reference });

		if (!verifyRef) {
			return [false, "PayStack payment error"];
		}

		if (verifyRef.status == false) {
			return [false, "PayStack payment error"];
		}

		if (verifyRef.data.status == "success") {
			const refExist = await this.#getReference({
				referenceID: verifyRef.data.reference,
			});

			if (refExist) {
				if (!refExist.isSuccessful) {
					const editedRef = await this.#editReferenceSuccess({
						referenceID: verifyRef.data.reference,
					});

					if (editedRef) {
						let emailOfRef = await this.#getByEmail(
							editedRef.purchaserEmail
						);

						if (!emailOfRef)
							return [false, "Unable to find user email"];

						this.#order = new orderModel({
							user: emailOfRef._id,
							pizza: editedRef.pizza,
							amount: refExist.amount,
						});

						this.data = await this.#order.save();

						return [true, this.data];
					}

					return [
						true,
						"Transaction successful but reference wasn't updated successfully",
					];
				}

				return [
					false,
					"Transaction has already been carried out in the past",
				];
			}

			return [false, "Reference data could not be retrieved"];
		}

		return [false, "Transaction unsuccessful"];
	}

	async getAllOrders() {
		this.data = await orderModel
			.find()
			.populate("user")
			.populate("pizza")
			.exec();

		return [true, this.data];
	}

	async getMyOrders(id) {
		this.data = await orderModel
			.find({ user: id })
			.populate("pizza")
			.exec();

		return [true, this.data];
	}

	async getOrder(id) {
		this.data = await orderModel
			.findById(id)
			.populate("user")
			.populate("pizza")
			.populate("reference")
			.exec();

		if (!this.data) return [false, "Order not found"];

		return [true, this.data];
	}

	async #createReference({ referenceID, pizza, amount, purchaserEmail }) {
		try {
			const newReference = Reference({
				referenceID,
				pizza,
				amount,
				purchaserEmail,
			});

			if (await newReference.save()) {
				return [true, newReference];
			}
		} catch (error) {
			return [false, translateError(error)];
		}
	}

	async #getReference({ referenceID }) {
		return await Reference.findOne({ referenceID }).exec();
	}

	async #editReferenceSuccess({ referenceID }) {
		return await Reference.findOneAndUpdate(
			{ referenceID },
			{ isSuccessful: true },
			{ new: true }
		).exec();
	}

	async #getByEmail(email) {
		return await User.findOne({ email }, { password: 0 });
	}
}

module.exports = Order;
