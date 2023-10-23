const Joi = require('joi');
const joiValidate = require('../../middlewares/joi-validate');

exports.payments = joiValidate({
	body: Joi.object().keys({
		token: Joi.string(),
		source: Joi.string(),
		email: Joi.string().required(),
		name: Joi.string().required(),
		currency: Joi.string().required(),
		amount: Joi.number().required(),
		reference: Joi.string().required(),
		securePayment: Joi.boolean(),
		success_url: Joi.string(),
		failure_url: Joi.string(),
		store_for_future_use: Joi.boolean(),
		country: Joi.string()
	}),
});
