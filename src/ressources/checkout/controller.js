const { Checkout } = require('checkout-sdk-node');
const constants = require('../../tools/constants');

exports.payments = async (req, res) => {

	let payment;
	let source;
	let genericPayload = {
		customer: {
			email: req.body.mail,
			name: req.body.name,
		},
		currency: req.body.currency,
		amount: req.body.amount,
		reference: req.body.reference,
		success_url: req.body.success_url,
		failure_url: req.body.failure_url,
	};

	try {
		console.log(req.body)
		const cko = new Checkout(constants.CKO_SECRET_KEY, { pk: constants.CKO_PUBLIC_KEY, timeout: 7000 });

		if (req.body.token) {
			source = {
				token: req.body.token,
			}
		}
		if (req.body.source) {
			source = {
				type: "id",
				id: req.body.source,
			}
		}

		genericPayload = { ...genericPayload, source};

		

		if(req.body.securePayment == 'true') {
			genericPayload = { ...genericPayload, "3ds":{enabled:true}};
			console.log(genericPayload);
			payment = await cko.payments.request(genericPayload);
		} else {
			console.log(genericPayload);
			payment = await cko.payments.request(genericPayload);
		}

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

exports.getCustomerDetails = async (req, res) => {
	try {
		const cko = new Checkout(constants.CKO_SECRET_KEY, { pk: constants.CKO_PUBLIC_KEY, timeout: 7000 });

		const customerDetails = await cko.customers.get(req.params.id);
		res.status(200).send(customerDetails)

	} catch (error) {
		if (error.message == 'NotFoundError')  
			return res.status(404).send(error);
		else 
			return res.status(500).send(error);
	}
};
