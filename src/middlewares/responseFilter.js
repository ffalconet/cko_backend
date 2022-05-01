/* eslint-disable max-len */
const _ = require('lodash');

function filteredResponse(req, res, next) {
	const oldSend = res.send;
	next();
}
module.exports = filteredResponse;
