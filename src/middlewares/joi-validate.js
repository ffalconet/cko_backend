const middleware = (rules) => (req, res, next) => {
	let err;
	if (rules.query) {
		const schema = rules.query;
		const { error } = schema.validate(req.query);
		err = error;
	} else if (rules.body) {
		const schema = rules.body;
		const { error } = schema.validate(req.body);
		err = error;
	}
	if (!err) {
		return next();
	}
	const { details } = err;
	const message = details.map((i) => i.message).join(',');
	return res.boom.badData(message);
};
module.exports = middleware;
