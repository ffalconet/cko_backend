const checkoutRouter = require('../ressources/checkout/routes');
const accountRouter = require('../ressources/account/routes');

module.exports = (app) => {
	app.use('/checkout', checkoutRouter);
	app.use('/account', accountRouter);
};
