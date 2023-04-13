import StellarSdk from "stellar-sdk";
import BigchainDB from "bigchaindb-driver";
import encryptor from "../../utils/encrypt.js";
import chainFunctions from "../../utils/chainLogic.js";
import { NETWORKS } from "../../utils/networks.js";
import Asset from "../models/asset.model.js";

//Stellar
const stellarServer = new StellarSdk.Server(
  "https://horizon-testnet.stellar.org"
);

//Big chain
const getKeypairFromChain = new BigchainDB.Ed25519Keypair();
const API_PATH = process.env.BIG_CHAIN_NET;
new BigchainDB.Connection(API_PATH);

export default {
  upload: async (req, res) => {
    const uploadedFile = req.file;
    const formData = req.body;
    const fromSecretKey = formData["fromSecretKey"];
    const toPublicKey = formData["toPublicKey"];

    const assetKeyPair = getKeypairFromChain;

    const assetdata = {
      model: {
        asset_type: "digital_asset",
        asset_issuer: "AutoCS platform",
      },
    };

    let cypher = encryptor.symmetricEncryption(
      JSON.stringify(uploadedFile),
      fromSecretKey
    );

    let cypherStringified = cypher.toString();
    assetdata.model.encrypted_model = cypherStringified;

    let metadata = {};
    for (let key of Object.keys(formData)) {
      metadata[key] = formData[key];
    }

    //delete privateKey and publicKey and add encryptionData
    delete metadata.fromSecretKey;

    try {
      let result = await chainFunctions.createAsset(assetdata, metadata);

      if (result.isErr) {
        return { message: "Bigchain DB error when uploading asset!" };
      }

      const assetObject = {
        publicKey: toPublicKey,
        assetTitle: metadata.assetTitle,
        assetData: encryptor.symmetricEncryption(
          JSON.stringify({
            assetDescription: metadata.assetDescription,
            assetID: result.res.id,
            assetKeyPair: assetKeyPair,
            assetPrice: metadata.assetPrice,
          }),
          fromSecretKey
        ),
      };
      await new Asset({ ...assetObject }).save();

      // Next, you'll need to load the account that you want to add data to
      const sourceKeypair = StellarSdk.Keypair.fromSecret(fromSecretKey);
      const sourceAccount = await stellarServer.loadAccount(
        sourceKeypair.publicKey()
      );

      // Then, you can create a transaction to add data to the account
      var transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        //define the base fee
        fee: 100,
        networkPassphrase: NETWORKS.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.manageData({
            name: metadata.assetTitle,
            value: encryptor.generateHash(
              JSON.stringify({
                assetDescription: metadata.assetDescription,
                assetID: result.res.id,
                assetKeyPair: assetKeyPair,
                assetPrice: metadata.assetPrice,
              })
            ),
          })
        )
        .setTimeout(30)
        .build();

      // Sign the transaction with the account's secret key
      transaction.sign(sourceKeypair);

      // Finally, submit the transaction to the network
      const stellarSubmit = await stellarServer.submitTransaction(transaction);
      return {
        message: "Upload successfull",
        data: stellarSubmit,
      };
    } catch (error) {
      console.log(error);
      return {
        message:
          "Stellar or MongoDb error when creating transaction on the asset!",
      };
    }
  },

  decryptAssetObject: async (body) => {
    const { key, fromSecretKey } = body;
    const encriptionObject = encryptor.symmetricDecryption(key, fromSecretKey);

    let response = "";
    const regex = /^[\],:{}\s]*$/;
    const isJSON = regex.test(
      encriptionObject
        .replace(/\\["\\\/bfnrtu]/g, "@")
        .replace(
          /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
          "]"
        )
        .replace(/(?:^|:|,)(?:\s*\[)+/g, "")
    );
    if (isJSON) {
      response = JSON.parse(encriptionObject);
    } else {
      response = encriptionObject;
    }

    return response;
  },

  searchAndDecryptAsset: async (req) => {
    let result = await chainFunctions.searchAndDecryptAsset(req.body);

    if (!result) {
      return {
        message: "Asset Not Found!!",
      };
    }

    const response = result;

    return { message: "Decrypted Asset", response };
  },

  searchAssetById: async (body) => {
    const formData = body;
    if (!formData.assetID) return;

    let result = await chainFunctions.searchAssetById(formData.assetID);

    if (result.isErr) {
      return {
        message: `"error when getting asset with id= " + ${formData.assetID}`,
      };
    }

    const response = result.res;

    return { message: "Fetched Asset", response };
  },

  searchAssetByMetadata: async (body) => {
    const formData = body;
    if (!formData.metadataKeyword) return;

    let result = await chainFunctions.searchAssetByMetadata(
      formData.metadataKeyword
    );

    if (result.isErr) {
      return {
        message: `"error when getting asset with metadata: " + ${formData.metadataKeyword}`,
      };
    }

    const response = result.res;

    return { message: "Fetched Asset", response };
  },

  transferAsset: async (req, res) => {
    let { assetID, issureKeyPair, fromSecretKey, toPublicKey, metadata } = req;
    const senderKeyPair = getKeypairFromChain;

    //Fetch the Asset by assetID or transactionId
    let assetResponse = await chainFunctions.searchAndDecryptAsset({
      assetID,
      fromSecretKey,
    });

    let cypher = encryptor.asymmetricEncryption(
      JSON.stringify(assetResponse.asset),
      toPublicKey,
      fromSecretKey
    );

    let cypherStringified = cypher.encryptedData;
    assetResponse.asset = cypherStringified;

    const { encryptedData, ...encryptionObject } = cypher;

    try {
      //txId, keypairTo, metaData, keypairFrom;
      var result = await chainFunctions.transferAsset(
        assetResponse,
        senderKeyPair,
        metadata,
        issureKeyPair
      );

      if (result.isErr) {
        return { message: "Error when transfering asset!" };
      }

      // Next, you'll need to load the account that you want to transfer data to
      const destinationAccount = await stellarServer.loadAccount(toPublicKey);

      // Then, you can create a transaction to add data to the account
      var transaction = new StellarSdk.TransactionBuilder(destinationAccount, {
        //define the base fee
        fee: 100,
        networkPassphrase: NETWORKS.TESTNET,
      })
        .TransactionBuilder(destinationAccount)
        .addOperation(
          StellarSdk.Operation.payment({
            destination: toPublicKey,
            asset: StellarSdk.Asset.native(),
            amount: metadata.assetPrice, // deduct the asset price from the destination account
          })
        )
        .addOperation(
          StellarSdk.Operation.manageData({
            name: metadata.assetTitle,
            value: encryptor.generateHash(
              JSON.stringify({
                assetID: cypher,
                assetKeyPair: senderKeyPair,
                encryptionObject: encryptionObject,
              })
            ),
          })
        )
        .setTimeout(30)
        .build();

      // Sign the transaction with the account's secret key
      transaction.sign(sourceKeypair);

      //save object in mongoDB
      const assetObject = {
        publicKey: toPublicKey,
        assetTitle: assetResponse.metadata.assetTitle,
        assetData: encryptor.symmetricEncryption(
          JSON.stringify({
            assetID: cypher,
            assetKeyPair: senderKeyPair,
            encryptionObject: encryptionObject,
          }),
          fromSecretKey
        ),
      };
      await new Asset({ ...assetObject }).save();

      // Finally, submit the transaction to the network
      const stellarSubmit = await stellarServer.submitTransaction(transaction);
      return {
        message: "Transfer successfull",
        data: stellarSubmit,
      };
    } catch (error) {
      console.log(error);
    }
    const response = { ...senderKeyPair, ...result };

    return { message: "Transfer successfull!!", response };
  },

  getKeyPair: async () => {
    try {
      //Big chain
      let newKeyPair = new BigchainDB.Ed25519Keypair();
      return newKeyPair;
    } catch (error) {
      console.log(error);
      return {
        message: "Couldn't get AssetKeyPair!",
      };
    }
  },
};
