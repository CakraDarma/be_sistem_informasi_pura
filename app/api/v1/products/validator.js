const Joi = require('joi');
const message = require('../../../utils/customValidation.js');

const { string, number } = message;

const schema = Joi.object({
	name: Joi.string().min(2).max(10).required().messages(string),
	price: Joi.number().integer().min(19).max(2013).message(number),
});

module.exports = {
	schema,
};
