const { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const fs = require("fs");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const url = require("url");
const querystring = require("querystring");

// Listen
var port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on localhost:'+ port);

// Function to query all cars
app.get('/queryallcars', async function (req, res) {
//async function queryallcars() {
  try {
    // load the network configuration
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "..",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    // Check to see if we've already enrolled the user.
    const identity = await wallet.get("appUser");
    if (!identity) {
      console.log(
        'An identity for the user "appUser" does not exist in the wallet'
      );
      console.log("Run the registerUser.js application before retrying");
      return;
    }
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "appUser",
      discovery: { enabled: true, asLocalhost: true },
    });
    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork("mychannel");
    // Get the contract from the network.
    const contract = network.getContract("fabcar");
    // Evaluate the specified transaction.
    // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
    // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
    const result = await contract.evaluateTransaction("queryAllCars");
    console.log(
      `Transaction has been evaluated, result is: ${result.toString()}`
    );
    
    const display = result.toString();
    res.status(200).json({response: result.toString()});	  

    // Disconnect from the gateway.
    await gateway.disconnect();
    return result;
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    res.status(500).json({response: result.toString()});
    process.exit(1);
  }
});

app.get('/query/:car_id', async function (req, res) {
  try {
    // load the network configuration
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "..",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    // Check to see if we've already enrolled the user.
    const identity = await wallet.get("appUser");
    if (!identity) {
      console.log(
        'An identity for the user "appUser" does not exist in the wallet'
      );
      console.log("Run the registerUser.js application before retrying");
      return;
    }
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "appUser",
      discovery: { enabled: true, asLocalhost: true },
    });
    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork("mychannel");
    // Get the contract from the network.
    const contract = network.getContract("fabcar");
    // Evaluate the specified transaction.
    // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
    // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
    
    const result = await contract.evaluateTransaction("queryCar", req.params.car_id);
    console.log(
      `Transaction has been evaluated, result is: ${result.toString()}`
    );
    res.status(200).json({response: result.toString()});
    // Disconnect from the gateway.
    await gateway.disconnect();
    return result;
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    res.status(500).json({error: error});	  
    process.exit(1);
  }
});
