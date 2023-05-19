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
		method: 'GET',
		path: '/customers/:id',
		authorization: authorizations.getCustomerDetails,
		controller: controller.getCustomerDetails,
	},
	{
		method: 'POST',
		path: '/tokens',
		authorization: authorizations.getToken,
		controller: controller.getToken,
	}


];
routesHelper.mountApiRoutes(router, routes.reverse());

module.exports = router;
