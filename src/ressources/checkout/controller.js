const { Checkout } = require('checkout-sdk-node');
const constants = require('../../tools/constants');
const gclConstants = require('gocardless-nodejs/constants');
const gocardless = require('gocardless-nodejs');
const fs = require("fs");
const https = require("https");
const axios = require("axios");
const Instrument = require('./model');
const MerchantConfig = require('../account/model');

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

		let cko;
		const merchantConfig = await MerchantConfig.findOne({name: req?.body?.merchant});
		if (!merchantConfig) {
			cko = new Checkout(constants.CKO_SECRET_KEY, { pk: constants.CKO_PUBLIC_KEY, timeout: 7000 });
		} else {
			cko = new Checkout(merchantConfig.secretKey, { pk: merchantConfig.publicKey, timeout: 7000 });
		}

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
		if(paymentDetails) {
			if (paymentDetails.source && paymentDetails.source.id) {

				const result = await Instrument.find({sourceId: paymentDetails.source.id});
				console.log(result)
				if (result && result.length == 0) {
					const instrument = new Instrument({
						buyerEmail: paymentDetails.customer.email,
						scheme: paymentDetails.source.scheme,
						sourceId: paymentDetails.source.id,
						bin: paymentDetails.source.bin,
						last4: paymentDetails.source.last4,
						expiryMonth: paymentDetails.source.expiry_month,
						expiryYear: paymentDetails.source.expiry_year,
					});
					
					await instrument.save();
					console.log('new instrument is saved : ' + instrument.bin + 'xxxxxxx' + instrument.last4 + ', ' + instrument.expiryMonth + '|' + instrument.expiryYear);
				}
			}
			res.status(200).send(paymentDetails);
		}

	} catch (error) {
		console.log(error);
		return res.status(500).send(error);
	}
};

exports.getPaymentDetailsPost = async (req, res) => {

	try {
		const merchant = req.body.merchant;
		const ckoSessionId = req.body.ckoSessionId;
		console.log(ckoSessionId)

		let cko;
		const merchantConfig = await MerchantConfig.findOne({name: req?.body?.merchant});
		if (!merchantConfig) {
			cko = new Checkout(constants.CKO_SECRET_KEY, { pk: constants.CKO_PUBLIC_KEY, timeout: 7000 });
		} else {
			cko = new Checkout(merchantConfig.secretKey, { pk: merchantConfig.publicKey, timeout: 7000 });
		}

		const paymentDetails = await cko.payments.get(ckoSessionId);
		console.log(paymentDetails);
		if(paymentDetails) {
			if (paymentDetails.source && paymentDetails.source.id) {

				const result = await Instrument.find({sourceId: paymentDetails.source.id, merchant:merchant});
				console.log(result)
				if (result && result.length == 0) {
					const instrument = new Instrument({
						merchant: merchant,
						buyerEmail: paymentDetails.customer.email,
						scheme: paymentDetails.source.scheme,
						sourceId: paymentDetails.source.id,
						bin: paymentDetails.source.bin,
						last4: paymentDetails.source.last4,
						expiryMonth: paymentDetails.source.expiry_month,
						expiryYear: paymentDetails.source.expiry_year,
					});
					
					await instrument.save();
					console.log('new instrument is saved : ' + instrument.bin + 'xxxxxxx' + instrument.last4 + ', ' + instrument.expiryMonth + '|' + instrument.expiryYear);
				}
			}
			res.status(200).send(paymentDetails);
		}

	} catch (error) {
		console.log(error);
		return res.status(500).send(error);
	}
};

/*exports.getCustomerDetails = async (req, res) => {
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
};*/


exports.getCustomerDetails = async (req, res) => {

	console.log(`get Instruments for  ${req.body.emailAddress}`);

	const buyerEmail = req.body.emailAddress;
	const merchant = req.body.merchant;

	try {
		const instruments = await Instrument.find({buyerEmail: buyerEmail, merchant: merchant});
		if (!instruments) return res.boom.notFound();
		
		console.log('instruments for   ' + buyerEmail + ' found');
		return res.send(instruments);
	} catch (error) {
		return res.boom.badImplementation();
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
		  merchantIdentifier: 'merchant.fr.falconet.applepay',
		  domainName: 'apple.falconet.fr',
		  displayName: "Merchand ID Falconet Sandbox",
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
	  await axios.post('https://webhook.site/d28cc1d9-8ffe-49a1-9fb8-15e242e8c6d8',
			payment);
	
	  res.send(payment);
	} catch (err) {
	  res.status(500).send(err);
	}
  };


  exports.sepaMandate = async (req, res) => {

	console.log(req.body)
	const client = gocardless('sandbox_SIgk06iRu15rVR22U4BINTp8eqx8qpEBettXXxUJ', gclConstants.Environments.Sandbox);
	const { currency, amount, success_url, failure_url } = req.body;

	try {
		const billingRequest = await client.billingRequests.create(
		/*	{
				payment_request: {
				description: "First Payment",
				amount,
				currency: currency,
				app_fee: amount,
				},
			} */
			{
				mandate_request: {
				scheme: "sepa_core"
			}}
		);
  
		if (billingRequest && billingRequest.id)
	  		console.log(`billingRequests done:  ${billingRequest.id} - status: ${billingRequest.status}`);
  
		const billingRequestFlow = await client.billingRequestFlows.create({
		redirect_uri: success_url,
		exit_uri: failure_url,
		links: {
			billing_request: billingRequest.id,
		}
		});
  
	  console.log("Billing Request flew", billingRequestFlow);
	  res.send(billingRequestFlow);
	} catch (err) {
	  res.status(500).send(err);
	}
  };


exports.createPaymentSession = async (req, res) => {

	try {
		console.log('Hello : ', req.body)
		let config;

		const merchantConfig = await MerchantConfig.findOne({name: req?.body?.merchant});
		console.log(merchantConfig)
		if (!merchantConfig) {
			config = {
				headers: { 
					Authorization: `Bearer ${constants.CKO_SECRET_KEY}`,
					'Content-Type': 'application/json' }
			};
		} else {
			config = {
				headers: { 
					Authorization: `Bearer ${merchantConfig.secretKey}`,
					'Content-Type': 'application/json' }
			};
		}

		let data = {
			amount: parseInt(req.body.amount),
			currency: req.body.currency,
			reference: req.body.reference,
			billing: {
			  address: {
				country: req.body.country
			  }
			},
			customer: {
			  name: req.body.name,
			  email: req.body.email
			},
			success_url: req.body.success_url,
			failure_url: req.body.failure_url
		  };
		
		  if(req.body.securePayment == 'true') {
			data = { ...data, "3ds":{ enabled:true }};
		}
		console.log(data)

		const response = await axios.post('https://api.sandbox.checkout.com/payment-sessions',
			data,
		  	config);

		return res.status(200).send(response.data);


	} catch (error) {
		console.log(error);
		return res.status(500).send(error);
	}
};



exports.createPaymentContext = async (req, res) => {

	try {
		console.log('Hello : ', req.body)
		let config;

		const merchantConfig = await MerchantConfig.findOne({name: req?.body?.merchant});
		if (!merchantConfig) {
			config = {
				headers: { 
					Authorization: `Bearer ${constants.CKO_SECRET_KEY}`,
					'Content-Type': 'application/json' }
			};
		} else {
			config = {
				headers: { 
					Authorization: `Bearer ${merchantConfig.secretKey}`,
					'Content-Type': 'application/json' }
			};
		}

		let data = {
			source: {
				type: 'paypal',
			},
			amount: parseInt(req.body.amount),
			currency: req.body.currency,
			payment_type: 'regular',
			reference: req.body.reference,
			capture: true,
			items: [{
				name: "laptop",
				unit_price: 2500,
				quantity : 1
			}],
			billing: {
			  address: {
				country: req.body.country
			  }
			},
			customer: {
			  name: req.body.name,
			  email: req.body.email
			},
			success_url: req.body.success_url,
			failure_url: req.body.failure_url,
		  };
		
		console.log(data)

		const response = await axios.post('https://api.sandbox.checkout.com/payment-contexts',
			data,
		  	config);

		return res.status(200).send(response.data);


	} catch (error) {
		console.log(error);
		return res.status(500).send(error);
	}
};


exports.paymentPaypal = async (req, res) => {

	try {
		console.log('Hello : ', req.body)

		let cko;
		const merchantConfig = await MerchantConfig.findOne({name: req?.body?.merchant});
		if (!merchantConfig) {
			cko = new Checkout(constants.CKO_SECRET_KEY, { pk: constants.CKO_PUBLIC_KEY, timeout: 7000 });
		} else {
			cko = new Checkout(merchantConfig.secretKey, { pk: merchantConfig.publicKey, timeout: 7000 });
		}

		let genericPayload = {
			payment_context_id: req.body.payment_context_id,
			currency: req.body.currency
		};
		
		console.log(genericPayload);
		payment = await cko.payments.request(genericPayload);
  
		console.log(payment)
		if(payment) res.status(200).send(payment);

	} catch (error) {
		console.log(error);
		return res.status(500).send(error);
	}
};

/*
exports.webhook = async (req, res) => {

	try {
		console.log('REQ BODY : ', req.body);
		console.log('REQ RAW : ', req.rawBody);
		console.log(req.rawBody);
		console.log('HEADER RECEIVED : ', req.headers)
		/*
		fs.writeFile('test.txt', req.rawBody.toString('hex'), err => {
			if (err) {
			  console.error(err);
			}
			// file written successfully
		});*/

		/*
		var crypto = require('crypto');

		const hmac = crypto.createHmac('sha256', '682bd2c2-6d2e-48f2-8ea8-f5f28623bcbb');
  		hmac.update(req.rawBody);
  		const signature = hmac.digest('hex');

		console.log("HMAC CALCULATED : ", signature);

		return res.status(200).send(signature);

	} catch (error) {
		console.log(error);
		return res.status(500).send(error);
	}
};*/
