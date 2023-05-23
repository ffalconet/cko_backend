const aclMiddleware = require('../../middlewares/acl');
const {
	ADMIN_ROLE,
} = require('../../tools/constants');

exports.create = aclMiddleware({
	roles: [ADMIN_ROLE],
});

exports.list = aclMiddleware({
	roles: [ADMIN_ROLE],
});

exports.get = aclMiddleware({
	roles: [ADMIN_ROLE],
});

exports.update = aclMiddleware({
	roles: [ADMIN_ROLE],
});

exports.delete = aclMiddleware({
	roles: [ADMIN_ROLE],
});