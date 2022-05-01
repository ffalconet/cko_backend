const _ = require('lodash');


module.exports = (acl) => {
	const middlewares = {};
	// if (acl.roles) {
	// 	middlewares.roles = async (req, res, next) => {
	// 		if (req.user.roles.includes('admin')) return next();
	// 		const hasRole = _.intersection(acl.roles, req.user.roles).length;
	// 		if (!hasRole) return res.boom.forbidden();
	// 		if (req.user.roles.length === 1 && req.user.roles[0] === 'shop_owner' && req.params.id) {
	// 			const shopIds = req.user.shops.map((shop) => shop._id.toString());
	// 			let shopId;
				
				
	// 			const hasAuthorization = shopIds.includes(shopId);
	// 			if (!hasAuthorization) return res.boom.forbidden();
	// 		}
	// 		return next();
	// 	};
	// }
	return middlewares;
};
