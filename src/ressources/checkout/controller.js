const { Checkout } = require('checkout-sdk-node');
const constants = require('../../tools/constants');
const fs = require("fs");
const https = require("https");
const axios = require("axios");

exports.payments = async (req, res) => {

	let payment;
	let source;
	let store_for_future_use;
	let genericPayload = {
		customer: {
			email: req.body.email,
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

		if (req.body.store_for_future_use && req.body.store_for_future_use == 'true')
			store_for_future_use = true;
		else
			store_for_future_use = false;

		if (req.body.token) {
			source = {
				token: req.body.token,
				store_for_future_use: store_for_future_use
			}
		}
		if (req.body.source && req.body.source != 'paypal') {
			source = {
				type: "id",
				id: req.body.source,
			}
		}
		if (req.body.source && req.body.source === 'paypal') {
			source = {
				type: "paypal",
			}
		}
		if (req.body.source && req.body.source === 'alma') {
			source = {
				type: "alma",
			}
		}

		genericPayload = { ...genericPayload, source};

		
		if (req.body.source === 'paypal') {
			genericPayload = { ...genericPayload, "items":[
			{	
				"name": "laptop",
				"unit_price": req.body.amount,
				"quantity": 1}]
			};
		}

		if (req.body.source === 'alma') {
			genericPayload = { ...genericPayload, "capture": true};
		}
		
		if(req.body.securePayment == 'true') {
			genericPayload = { ...genericPayload, "3ds":{enabled:true}};
		}

		console.log(genericPayload);
		payment = await cko.payments.request(genericPayload);

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
		console.log(paymentDetails);
		if(paymentDetails) res.status(200).send(paymentDetails);

	} catch (error) {
		console.log(error);
		return res.status(500).send(error);
	}
};

exports.getCustomerDetails = async (req, res) => {
	console.log(`get Instruments for  ${req.params.id}`);
	try {
		const cko = new Checkout(constants.CKO_SECRET_KEY, { pk: constants.CKO_PUBLIC_KEY, timeout: 7000 });
		
		const customerDetails = await cko.customers.get(req.params.id);
		console.log(customerDetails);
		res.status(200).send(customerDetails)

	} catch (error) {
		if (error.message == 'NotFoundError')  
			return res.status(404).send(error);
		else 
			return res.status(500).send(error);
	}
};

exports.getToken = async (req, res) => {
	console.log(`get Token for  ${req.body.signature} and ${req.body.type} `);
	try {
		const cko = new Checkout(constants.CKO_SECRET_KEY, { pk: constants.CKO_PUBLIC_KEY, timeout: 7000 });
		
		const tokenRequest = {
			token_data: {
				protocolVersion: req.body.protocolVersion,
				signature: req.body.signature,
				signedMessage: req.body.signedMessage,
			  },
			type: req.body.type,
		};

		const tokenReponse = await cko.tokens.request(tokenRequest);
		res.status(200).send(tokenReponse);
		

	} catch (error) {
		if (error.message == 'NotFoundError')  
			return res.status(404).send(error);
		else 
			return res.status(500).send(error);
	}
};


exports.validateAppleSession = async (req, res) => {

	console.log('ici');
	const { appleUrl } = req.body;
	console.log(appleUrl);
  
	let httpsAgent;
	const cert = "./certificates/certificate_sandbox.pem";
	const key = "./certificates/certificate_sandbox.key";
	
  
	httpsAgent = new https.Agent({
	  rejectUnauthorized: false,
	  cert: fs.readFileSync(cert),
	  key: fs.readFileSync(key),
	});
  
	try {
	  response = await axios.post(
		appleUrl,
		{
		  merchantIdentifier: 'merchant.sandbox.fr',
		  domainName: 'voldoizoaix.com',
		  displayName: "Test",
		},
		{
		  httpsAgent,
		}
	  );
	  res.send(response.data);
	} catch (err) {
	  console.log(err);
	  res.sendStatus(500)(err);
	}
  };
  
  exports.payWithApple = async (req, res) => {
	const { version, data, signature, header } =
	  req.body.details.token.paymentData;

	const cko = new Checkout(constants.CKO_SECRET_KEY , { pk: constants.CKO_PUBLIC_KEY, timeout: 7000 });
	const { currency, price } = req.body;
  
	try {
	  const token = await cko.tokens.request({
		token_data: {
		  version: version,
		  data: data,
		  signature: signature,
		  header: {
			ephemeralPublicKey: header.ephemeralPublicKey,
			publicKeyHash: header.publicKeyHash,
			transactionId: header.transactionId,
		  },
		},
	  });
  
	  console.log("Apple Pay tokenization outcome", token);
  
	  const payment = await cko.payments.request({
		source: {
		  type: "token",
		  token: token.token,
		},
		"3ds": {
		  enabled: true,
		  attempt_n3d: true,
		},
		amount: Math.floor(price * 100),
		currency,
		reference: "APPLE PAY",
	  });
  
	  console.log("Apple Pay payment outcome", payment);
	  res.send(payment);
	} catch (err) {
	  res.status(500).send(err);
	}
  };

