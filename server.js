const express = require('express');
const passport = require('passport');
const path = require('path');
const mustacheExpress = require('mustache-express');
const cors = require('cors');
const boom = require('express-boom');
const cookieParser = require('cookie-parser');

const jwtStrategy = require('./src/middlewares/strategies/jwt');

require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` });

// create express app
const app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(boom());
app.use(cookieParser());

app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));

// require('./src/config/passport.config')(passport);
passport.use(jwtStrategy());
app.use(passport.initialize());

app.use(express.static(path.join(__dirname, 'views')));

require('./src/routes')(app);

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', `${__dirname}/views`);

// listen for incoming requests
const server = app.listen(4000, () => {
	console.log(`Server is listening on port 4000`);
});


module.exports = app;
