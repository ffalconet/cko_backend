const jwt = require('jsonwebtoken');
const accessTokenSecret = require('../config/middleAdmin.config').secretOrKey;

module.exports = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (authHeader) {
		const token = authHeader.split(' ')[1];

		jwt.verify(token, accessTokenSecret, (err, decoded) => {
			if (err) {
				if (req.url === '/deviceClient' && req.method === 'POST') { // Gestion de l'ajout d'un device non connecté (notification push)
					return next();
				}
				return res.status(403).send({ message: 'Non authentifié' });
			}
			req.username = decoded.username;
			req.userid = decoded.id;
			return next();
		});
	} else {
		res.sendStatus(401);
	}
};
