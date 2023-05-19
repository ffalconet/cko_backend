const aclMiddleware = require('../../middlewares/acl');
const {
	ADMIN_ROLE,
} = require('../../tools/constants');

exports.payments = aclMiddleware({
	roles: [ADMIN_ROLE],
});

exports.sofortRequest = aclMiddleware({
	roles: [ADMIN_ROLE],
});

exports.getPaymentDetails = aclMiddleware({
	roles: [ADMIN_ROLE],
});

exports.getCustomerDetails = aclMiddleware({
	roles: [ADMIN_ROLE],
});

exports.getToken = aclMiddleware({
	roles: [ADMIN_ROLE],
});

exports.validateAppleSession = aclMiddleware({
	roles: [ADMIN_ROLE],
});

exports.payWithApple = aclMiddleware({
	roles: [ADMIN_ROLE],
});