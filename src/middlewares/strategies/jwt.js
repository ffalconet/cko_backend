/**
 * Module dependencies
 */

const { Strategy, ExtractJwt } = require('passport-jwt');
const config = require('../../config/jwt.json');

const extractJwtFromHeaderOrCookie = (req) => {
	if (req.cookies) {
		const { jwt } = req.cookies;
		if (jwt) return jwt;
	}
	return ExtractJwt.fromAuthHeaderWithScheme('Bearer')(req);
};

module.exports = () => {
	const options = {
		jwtFromRequest: extractJwtFromHeaderOrCookie,
		...config.jwt,
	};
	const fetchUser = async (jwtPayload, done) => {
		if (jwtPayload) {
			try {
				const user = await User.findOne({ email: jwtPayload.email });
				return done(null, user);
			} catch (error) {
				done(error, false);
			}
		}
		return done(null, false);
	};
	const jwtStrategy = new Strategy(options, fetchUser);
	return jwtStrategy;
};
