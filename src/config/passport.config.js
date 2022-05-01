const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const Vendor = require('../ressources/vendor/vendor.model');
const keys = require('./database.config');

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = (passport) => {
	passport.use(
		new JwtStrategy(opts, (jwtPayload, done) => {
			console.info('payload ==> ', jwtPayload);
			return done(null, { user: 'test' });
			// Vendor.findById(jwtPayload.id)
			// 	.then((vendor) => {
			// 		if (vendor) {
			// 			return done(null, vendor);
			// 		}
			// 		return done(null, false);
			// 	})
			// 	.catch((err) => console.log('Passport catch: ', err));
		}),
	);
};
