const { Checkout } = require('checkout-sdk-node');
const constants = require('../../tools/constants');

exports.payments = async (req, res) => {

	let payment;
	try {
		console.log(req.body)
		const cko = new Checkout(constants.CKO_SECRET_KEY, { pk: constants.CKO_PUBLIC_KEY, timeout: 7000 });

		const payload = {
			source: {
				token: req.body.token,
			},
			customer: {
				email: req.body.mail,
				name: req.body.name,
			},
			currency: req.body.currency,
			amount: req.body.amount,
			reference: req.body.reference,
		};

		const securePayload = {
			source: {
				token: req.body.token,
			},
			customer: {
				email: req.body.mail,
				name: req.body.name,
			},
			currency: req.body.currency,
			amount: req.body.amount,
			reference: req.body.reference,
			"3ds": {
				enabled: true,
			},
			success_url: req.body.success_url,
			failure_url: req.body.failure_url,
		}

		if(req.body.securePayment)
			payment = await cko.payments.request(securePayload);
		else
			payment = await cko.payments.request(payload);

		console.log(payment)
		if(payment) res.status(200).send(payment);

	} catch (error) {
		console.log(error);
		return res.status(500).send(error);
	}
};


exports.sofortRequest = async (req, res) => {

	try {
		console.log(req.body)
		const cko = new Checkout(constants.CKO_SECRET_KEY, { pk: constants.CKO_PUBLIC_KEY, timeout: 7000 });

		const sofortRequest = await cko.payments.request({
			source: {
				type: 'sofort',
			},
			currency: req.body.currency,
			amount: req.body.amount,
			success_url: req.body.success_url,
			failure_url: req.body.failure_url,
		});
		if(sofortRequest) res.status(200).send(sofortRequest);

	} catch (error) {
		console.log(error);
		return res.status(500).send(error);
	}
};


exports.getPaymentDetails = async (req, res) => {

	try {
		console.log(req.params.id)
		const cko = new Checkout(constants.CKO_SECRET_KEY, { pk: constants.CKO_PUBLIC_KEY, timeout: 7000 });

		const paymentDetails = await cko.payments.get(req.params.id);
		if(paymentDetails) res.status(200).send(paymentDetails);

	} catch (error) {
		console.log(error);
		return res.status(500).send(error);
	}
};
