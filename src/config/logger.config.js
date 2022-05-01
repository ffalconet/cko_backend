const {
	createLogger, format, transports,
} = require('winston');
require('winston-daily-rotate-file');

const myformat = format.combine(
	format.colorize(process.stdout.isTTY),
	format.timestamp(),
	format.align(),
	format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

const transport = new (transports.DailyRotateFile)({
	filename: 'logs/checkout-%DATE%.log',
	datePattern: 'YYYY-MM-DD',
	zippedArchive: true,
	maxSize: '20m',
	maxFiles: '14d',
	format: myformat,
});
const vendorLogger = createLogger({
	transports: [
		new transports.Console({
			format: myformat,
		}),
		transport,
	],
});
const paymentLogger = createLogger({
	transports: [
		new transports.Console({
			format: myformat,
		}),
		transport,
	],
});
const logger = createLogger({
	transports: [
		new transports.Console({
			format: myformat,
		}),
		transport,
	],
});

module.exports = {
	vendorLogger,
	paymentLogger,
	logger,
};
