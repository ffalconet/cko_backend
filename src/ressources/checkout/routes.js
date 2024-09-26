const express = require('express');
const controller = require('./controller');
const authorizations = require('./authorizations');
const validations = require('./validations');
const routesHelper = require('../../helpers/routes');

const router = express.Router();
const routes = [
	{
		method: 'POST',
		path: '/payments',
		authorization: authorizations.payments,
		validation: validations.payments,
		controller: controller.payments,
	},
	{
		method: 'POST',
		path: '/sofortRequest',
		authorization: authorizations.sofortRequest,
		controller: controller.sofortRequest,
	},
	{
		method: 'GET',
		path: '/payments/:id',
		authorization: authorizations.getPaymentDetails,
		controller: controller.getPaymentDetails,
	},
	{
		method: 'POST',
		path: '/payments/getPaymentDetails',
		authorization: authorizations.getPaymentDetailsPost,
		controller: controller.getPaymentDetailsPost,
	},
	{
		method: 'POST',
		path: '/customers',
		authorization: authorizations.getCustomerDetails,
		controller: controller.getCustomerDetails,
	},
	{
		method: 'POST',
		path: '/tokens',
		authorization: authorizations.getToken,
		controller: controller.getToken,
	},
	{
		method: 'POST',
		path: '/validateAppleSession',
		authorization: authorizations.validateAppleSession,
		controller: controller.validateAppleSession,
	},
	{
		method: 'POST',
		path: '/payWithApple',
		authorization: authorizations.payWithApple,
		controller: controller.payWithApple,
	},
	{
		method: 'POST',
		path: '/sepaMandate',
		authorization: authorizations.sepaMandate,
		controller: controller.sepaMandate,
	},
	{
		method: 'POST',
		path: '/payment-sessions',
		authorization: authorizations.payments,
		validation: validations.payments,
		controller: controller.createPaymentSession,
	},
	{
		method: 'POST',
		path: '/payment-contexts',
		authorization: authorizations.payments,
		validation: validations.payments,
		controller: controller.createPaymentContext,
	},
	{
		method: 'POST',
		path: '/klarna-payment-contexts',
		authorization: authorizations.payments,
		validation: validations.payments,
		controller: controller.createKlarnaPaymentContext,
	},
	{
		method: 'POST',
		path: '/payment-paypal',
		authorization: authorizations.payments,
		//validation: validations.payments,
		controller: controller.paymentPaypal,
	},
	{
		method: 'GET',
		path: '/jwttoken',
		authorization: authorizations.payments,
		//validation: validations.payments,
		controller: controller.jwttoken,
	}
	/*,
	{
		method: 'POST',
		path: '/webhook',
		authorization: authorizations.payments,
		//validation: validations.payments,
		controller: controller.webhook,
	}*/
];
routesHelper.mountApiRoutes(router, routes.reverse());

module.exports = router;
