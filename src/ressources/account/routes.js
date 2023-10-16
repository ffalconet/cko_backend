const express = require('express');
const controller = require('./controller');
const authorizations = require('./authorizations');
const validations = require('./validations');
const routesHelper = require('../../helpers/routes');

const router = express.Router();
const routes = [
	{
		method: 'POST',
		path: '/create',
		authorization: authorizations.create,
		//validation: validations.create,
		controller: controller.create,
	},
	{
		method: 'GET',
		path: '/list/all',
		authorization: authorizations.list,
		controller: controller.list,
	},
	{
		method: 'GET',
		path: '/:id',
		authorization: authorizations.get,
		controller: controller.get,
	},
	{
		method: 'PUT',
		path: '/:id',
		authorization: authorizations.update,
		controller: controller.update,
	},
	{
		method: 'GET',
		path: '/AuthenticateIK',
		authorization: authorizations.authenticateIK,
		controller: controller.authenticateIK,
	},
	{
		method: 'GET',
		path: '/default',
		authorization: authorizations.get,
		controller: controller.getDefaultConfig,
	},
];
routesHelper.mountApiRoutes(router, routes.reverse());

module.exports = router;
