const fs = require("fs");
const ImageKit = require("imagekit");
const constants = require('../../tools/constants');
const dataPath = './src/config/merchantConfig.json';  // path to our JSON file
const MerchantConfig = require('./model');

const imageKit = new ImageKit({
    publicKey: constants.IMAGEKIT_PUBLIC_KEY,
    privateKey: constants.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: constants.IMAGEKIT_URL_ENDPOINT,
})


async function updateAllDefaultConfig () {

	let result;
	try {
		result  = await MerchantConfig.updateMany({default : true}, { default: false}, { multi: true });
		return result;
	} catch (e) {
		console.log(e);
	}
}

exports.create = async (req, res) => {

	const inputMerchantConfig = req.body;

	console.log(inputMerchantConfig.defaultConfig)

	if (inputMerchantConfig.defaultConfig == 'true') {
		await updateAllDefaultConfig();
	}

	try {
		const merchantConfig = new MerchantConfig({
			name: inputMerchantConfig.name,
			publicKey: inputMerchantConfig.publicKey,
			secretKey: inputMerchantConfig.secretKey,
			logoImage: inputMerchantConfig.logoImage,
			productImage: inputMerchantConfig.productImage,
			bgImage: inputMerchantConfig.bgImage,
			primaryColor: inputMerchantConfig.primaryColor,
			secondaryColor: inputMerchantConfig.secondaryColor,
			thirdColor: inputMerchantConfig.thirdColor,
			checkColor: inputMerchantConfig.checkColor,
			brand: inputMerchantConfig.brand,
			productName: inputMerchantConfig.productName,
			productDesc: inputMerchantConfig.productDesc,
			productPrice: inputMerchantConfig.productPrice,
			discount: inputMerchantConfig.discount,
			buyerEmail: inputMerchantConfig.buyerEmail,
			googlePayActive: inputMerchantConfig.googlePayActive,
			applePayActive: inputMerchantConfig.applePayActive,
			paypalActive: inputMerchantConfig.paypalActive,
			almaActive: inputMerchantConfig.almaActive,
			sepaActive: inputMerchantConfig.sepaActive,
			default: inputMerchantConfig.defaultConfig
		});
		
		const newMerchantConfig = await merchantConfig.save();
		console.log('new merchantConfig is saved : ' + newMerchantConfig.name);
		return res.send(newMerchantConfig);
	} catch (error) {
		return res.boom.badImplementation('unable to create new merchant config');
	}
};

exports.list = async (req, res) => {
	try {
		const accounts = await MerchantConfig.find();
		console.log('all merchant configs found');
		return res.send(accounts);
	} catch (error) {
		return res.boom.badImplementation('unable to find products');
	}
};

exports.get = async (req, res) => {

	const accountId = req.params.id;

	try {
		const accountData = await MerchantConfig.findOne({name: accountId});
		if (!accountData) return res.boom.notFound();
		
		console.log('merchantConfig ' + accountId + ' found');
		return res.send(accountData);
	} catch (error) {
		return res.boom.badImplementation();
	}
};

exports.update = async (req, res) => {
	
	const accountId = req.params['id'];
	const inputMerchantConfig = req.body;

	let merchantConfig;
	try {
		merchantConfig = await MerchantConfig.findOne({name: accountId});
		if (!merchantConfig) return res.boom.notFound('Merchant config not found');
	} catch (error) {
		return res.boom.badImplementation();
	}
	console.log(inputMerchantConfig.defaultConfig)

	if (inputMerchantConfig.defaultConfig) {
		await updateAllDefaultConfig();
	}

	try {
		merchantConfig.name = inputMerchantConfig.name,
		merchantConfig.publicKey = inputMerchantConfig.publicKey,
		merchantConfig.secretKey = inputMerchantConfig.secretKey,
		merchantConfig.logoImage = inputMerchantConfig.logoImage,
		merchantConfig.productImage = inputMerchantConfig.productImage,
		merchantConfig.bgImage = inputMerchantConfig.bgImage,
		merchantConfig.primaryColor = inputMerchantConfig.primaryColor,
		merchantConfig.secondaryColor = inputMerchantConfig.secondaryColor,
		merchantConfig.thirdColor = inputMerchantConfig.thirdColor,
		merchantConfig.checkColor = inputMerchantConfig.checkColor,
		merchantConfig.brand = inputMerchantConfig.brand,
		merchantConfig.productName = inputMerchantConfig.productName,
		merchantConfig.productDesc = inputMerchantConfig.productDesc,
		merchantConfig.productPrice = inputMerchantConfig.productPrice,
		merchantConfig.discount = inputMerchantConfig.discount,
		merchantConfig.buyerEmail = inputMerchantConfig.buyerEmail,
		merchantConfig.googlePayActive = inputMerchantConfig.googlePayActive,
		merchantConfig.applePayActive = inputMerchantConfig.applePayActive,
		merchantConfig.paypalActive = inputMerchantConfig.paypalActive,
		merchantConfig.almaActive = inputMerchantConfig.almaActive,
		merchantConfig.sepaActive = inputMerchantConfig.sepaActive,
		merchantConfig.default =  inputMerchantConfig.defaultConfig

		await merchantConfig.save();
		console.log('merchant config : ' + merchantConfig.name + ', properly updated');
		return res.send(merchantConfig);
	} catch (error) {
		console.log(error);
		return res.boom.badImplementation('cannot update merchant config');
	}

};


exports.authenticateIK = async (req, res) => {

	var authenticationParameters = imageKit.getAuthenticationParameters();
	console.log(authenticationParameters);
	res.send(authenticationParameters)
};


exports.getDefaultConfig = async (req, res) => {
	try {
		const account = await MerchantConfig.findOne({'default':true});
		console.log('Default merchant config found');
		return res.send(account);
	} catch (error) {
		return res.boom.badImplementation('unable to find default Config');
	}
};