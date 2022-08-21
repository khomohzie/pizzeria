const transporter = require("../config/email");

class Common {
	constructor() {
		this.data = [];
		this.errors = [];
	}

	async getById(model, id) {
		return await model.findById(id).exec();
	}

	getAll() {
		return this.data;
	}

	//* This method will be overriden in the sub classes
	update(model) {
		return true;
	}

	save(obj) {
		if (this.validate(obj)) {
			this.data.push(obj);
			return true;
		}

		return false;
	}

	async delete(model, id) {
		await model.findByIdAndDelete(id);

		return true;
	}

	//* This method will be overriden in the sub classes
	validate(obj) {
		return true;
	}

	static sendMail(obj, callback) {
		const msg = {
			from: process.env.MAIL_USERNAME,
			to: obj.email,
			subject: obj.subject,
			html: obj.html,
		};

		transporter.sendMail(msg, (err, info) => {
			if (err) {
				console.log(err);
				return callback(false, err);
			}

			return callback(
				true,
				`Email successfully sent to ${info.accepted[0]}`
			);
		});
	}
}

module.exports = Common;
