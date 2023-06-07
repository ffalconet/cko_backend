const express = require('express');
const passport = require('passport');
const path = require('path');
const mustacheExpress = require('mustache-express');
const cors = require('cors');
const boom = require('express-boom');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const dbUrl = `mongodb+srv://ffalconet:cf2iLAzJHaaIapBf@democko.fn1dnhu.mongodb.net/demo-cko?retryWrites=true&w=majority`;


mongoose.connect(dbUrl, {
	//useFindAndModify: false,
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', () => { console.error('DB connection error'); });
db.once('open', () => {
	console.info('new DB connection successful');
});

// create express app
const app = express();
app.use(cors({ credentials: true, origin: '*' }));
app.options('*', cors());

app.use(boom());
app.use(cookieParser());

app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));

// require('./src/config/passport.config')(passport);
// passport.use(jwtStrategy());
// app.use(passport.initialize());

app.use(express.static(path.join(__dirname, 'views')));

require('./src/routes')(app);

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', `${__dirname}/views`);

app.get('/', (req, res) => res.send('Demo CKO Server Launched!!!'));

// listen for incoming requests
const server = app.listen(process.env.PORT || 4000, () => {
	console.log(`Server is listening on port ${process.env.PORT} or 4000`);
});


module.exports = app;
