const passport = require('passport');
const filteredResponseMiddleware = require('../middlewares/responseFilter');

const passportAuthenticate = async (req, res, next) => passport.authenticate('jwt', { session: false }, (err, user) => {
	if (err) throw err;
	if (user) {
		req.user = user;
		return next();
	}
	return res.boom.unauthorized();
})(req, res, next);

const getRouteMiddlewares = (route) => {
	const middlewares = [];
	if (route.authentication && route.authentication === 'jwt') {
		middlewares.push(passportAuthenticate);
	}
	if (route.authorization && route.authorization.roles) {
		middlewares.push(route.authorization.roles);
	}
	if (route.validation) {
		middlewares.push(route.validation);
	}
	middlewares.push(filteredResponseMiddleware);
	return middlewares;
};

exports.mountApiRoutes = (router, routes) => {
	routes.forEach((route) => {
		if (!route.path) return;
		const middlewares = getRouteMiddlewares(route);
		router[route.method.toLowerCase()](route.path, middlewares, route.controller);
	});
};
