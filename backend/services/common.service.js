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

	delete(model, id) {
		model.findByIdAndDelete(id);

		return true;
	}

	//* This method will be overriden in the sub classes
	validate(obj) {
		return true;
	}
}

module.exports = Common;
