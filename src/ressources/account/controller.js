const fs = require("fs");
const dataPath = './src/config/merchantConfig.json';  // path to our JSON file


// util functions
const saveAccountData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(dataPath, stringifyData)
}
const getAccountData = () => {
    const jsonData = fs.readFileSync(dataPath)
    return JSON.parse(jsonData)   
}

exports.create = async (req, res) => {

	var existAccounts = getAccountData()
    const newAccountId = Math.floor(100000 + Math.random() * 900000)
 
    existAccounts[newAccountId] = req.body
   
    console.log(existAccounts);
    saveAccountData(existAccounts);
    res.send({success: true, msg: 'account added successfully'})
	
};

exports.list = async (req, res) => {
	const accounts = getAccountData()
	res.send(accounts);
};

exports.get = async (req, res) => {
	
	var existAccounts = getAccountData()
	fs.readFile(dataPath, 'utf8', (err, data) => {
	  const accountId = req.params['id'];
	  const accountData = existAccounts[accountId];
	  console.log(accountData)
	  res.send(accountData)
	}, true);
	
};

exports.update = async (req, res) => {

	var existAccounts = getAccountData()
	fs.readFile(dataPath, 'utf8', (err, data) => {
	  const accountId = req.params['id'];
	  existAccounts[accountId] = req.body;
	  saveAccountData(existAccounts);
	  res.send(`accounts with id ${accountId} has been updated`)
	}, true);
};

exports.delete = async (req, res) => {

	fs.readFile(dataPath, 'utf8', (err, data) => {
		var existAccounts = getAccountData()
		const userId = req.params['id'];
		delete existAccounts[userId]; 
		saveAccountData(existAccounts);
		res.send(`accounts with id ${userId} has been deleted`)
	  }, true);
	
};