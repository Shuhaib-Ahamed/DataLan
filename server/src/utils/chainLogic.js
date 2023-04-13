import BigchainDB from "bigchaindb-driver";
import encryptor from "./encrypt.js";
import { v4 as uuidv4 } from "uuid";
import StellarSdk from "stellar-sdk";
import Asset from "../api/models/asset.model.js";
import { ENCRYPTION, STATE } from "./enums.js";

//Big chain
const API_PATH = process.env.BIG_CHAIN_NET;
const chainConnection = new BigchainDB.Connection(API_PATH);
const getKeypairFromChain = new BigchainDB.Ed25519Keypair();

let ChainFunctions = {
  //createSimpleAsset: creates and posts a new asset transaction on the blockchain,
  //using the provided keypair, asset data, and metadata.

  createSimpleAsset: async (keypair, asset, metadata) => {
    const txSimpleAsset = BigchainDB.Transaction.makeCreateTransaction(
      asset,
      metadata,
      [
        BigchainDB.Transaction.makeOutput(
          BigchainDB.Transaction.makeEd25519Condition(keypair.publicKey)
        ),
      ],
      keypair.publicKey
    );

    // Sign the transaction with private keys
    const txSigned = BigchainDB.Transaction.signTransaction(
      txSimpleAsset,
      keypair.privateKey
    );

    //send the transaction to the blockchain
    let assetObj = null;
    let result = { isErr: false, res: assetObj };

    try {
      assetObj = await chainConnection.postTransaction(txSigned); //or USE: searchAssets OR pollStatusAndFetchTransaction
    } catch (err) {
      console.log(
        "🚀 ~ file: chainLogic.js:43 ~ createSimpleAsset: ~ err",
        err
      );

      result.isErr = true;
      return result;
    }
    result.isErr = false;
    result.res = assetObj;
    return result;
  },

  searchAndDecryptAsset: async (body) => {
    const { assetID, fromSecretKey } = body;

    let foundAsset = await ChainFunctions.searchAssetById(assetID);
    let decryptedFile = null;

    if (foundAsset) {
      const encModel = foundAsset.asset.data.model.encrypted_model;
      decryptedFile = encryptor.symmetricDecryption(encModel, fromSecretKey);
    }
    return foundAsset;
  },

  searchAssetById: async (assetID) => {
    return await chainConnection.getTransaction(assetID);
  },

  searchAssetByMetadata: async (metadataKeyword) => {
    let assetObj = null;
    let result = { isErr: false, res: assetObj };

    try {
      assetObj = await chainConnection.searchMetadata(metadataKeyword);
    } catch (err) {
      result.isErr = true;
      return result;
    }

    result.isErr = false;
    result.res = assetObj;
    return result;
  },

  upload: async (data, stellarServer, start, transactions) => {
    const {
      fromSecretKey,
      fromPublicKey,
      toPublicKey,
      metadata,
      uploadedFile,
      type,
    } = data;

    const file = JSON.stringify(uploadedFile);

    //inntialize
    let cypher;
    let cypherText;
    let stellarHash;

    const assetKeyPair = getKeypairFromChain;

    if (!metadata.assetTitle) return { message: "Asset title missing!!!" };

    //Make the title UNIQUE cause uploading it to the same title could update the transaction
    if (metadata.assetTitle.split("-")) {
      const newTitle = metadata.assetTitle.split("-")[0];
      metadata.assetTitle = newTitle;
    }

    metadata.assetTitle = `${metadata.assetTitle} - ${uuidv4()}`;

    if (metadata.assetTitle.length > 64) {
      return { message: "Asset name should be less than 64 characters!!!" };
    }

    if (!metadata.assetDescription)
      return { message: "Asset description missing!!!" };
    if (!metadata.assetPrice) return { message: "Asset price missing!!!" };

    const assetdata = {
      model: {
        asset_type: "digital_asset",
        asset_issuer: "AutoCS platform",
      },
    };

    if (type === ENCRYPTION.AES) {
      cypher = encryptor.symmetricEncryption(file, fromSecretKey);
      assetdata.model.encrypted_model = cypher;
    } else if (type === ENCRYPTION.RSA) {
      cypher = encryptor.asymmetricEncryption(file, toPublicKey, fromSecretKey);
      assetdata.model.encrypted_model = cypher.encryptedData;
    } else return { message: "Please provide encryption type!!!" };

    try {
      let result = await ChainFunctions.createSimpleAsset(
        assetKeyPair,
        assetdata,
        metadata
      );

      if (result.isErr) {
        return { message: "Bigchain DB error when uploading asset!" };
      }

      if (type === ENCRYPTION.AES) {
        cypherText = encryptor.symmetricEncryption(
          JSON.stringify({
            assetTitle: metadata.assetTitle,
            assetDescription: metadata.assetDescription,
            assetID: result.res.id,
            assetKeyPair: assetKeyPair,
            assetPrice: metadata.assetPrice,
          }),
          fromSecretKey
        );
      } else if (type === ENCRYPTION.RSA) {
        //delete asset from the encryption object
        delete cypher.encryptedData;
        cypherText = encryptor.asymmetricEncryption(
          JSON.stringify({
            assetTitle: metadata.assetTitle,
            assetDescription: metadata.assetDescription,
            assetID: result.res.id,
            assetKeyPair: assetKeyPair,
            assetPrice: metadata.assetPrice,
            encryptioObject: cypher,
          }),
          toPublicKey,
          fromSecretKey
        );
      } else return { message: "Please provide encryption type!!!" };

      const assetObject = {
        publicKey: fromPublicKey,
        assetTitle: metadata.assetTitle,

        assetData:
          type === ENCRYPTION.AES ? cypherText : JSON.stringify(cypherText),
        isVerified: type === ENCRYPTION.AES ? true : false,
        encryptionType:
          type === ENCRYPTION.AES ? ENCRYPTION.AES : ENCRYPTION.RSA,
        status: type === ENCRYPTION.AES ? STATE.OWNED : STATE.TRANSFERED,
      };

      if (type === ENCRYPTION.AES) {
        stellarHash = encryptor.generateHash(
          JSON.stringify({
            assetTitle: metadata.assetTitle,
            assetDescription: metadata.assetDescription,
            assetID: result.res.id,
            assetKeyPair: assetKeyPair,
            assetPrice: metadata.assetPrice,
          })
        );
      } else if (type === ENCRYPTION.RSA) {
        stellarHash = encryptor.generateHash(
          JSON.stringify({
            assetTitle: metadata.assetTitle,
            assetDescription: metadata.assetDescription,
            assetID: result.res.id,
            assetKeyPair: assetKeyPair,
            assetPrice: metadata.assetPrice,
            encryptioObject: cypher,
          })
        );
      } else return { message: "Please provide encryption type!!!" };

      if (!stellarHash) return { message: "Couldn't find stellar hash!!!" };

      // Next, you'll need to load the account that you want to add data to
      const sourceKeypair = StellarSdk.Keypair.fromSecret(fromSecretKey);
      const sourceAccount = await stellarServer.loadAccount(
        sourceKeypair.publicKey()
      );

      // Then, you can create a transaction to add data to the account
      var transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.manageData({
            name: metadata.assetTitle,
            value: stellarHash,
          })
        )
        .setTimeout(30)
        .build();

      // Sign the transaction with the account's secret key
      transaction.sign(sourceKeypair);

      // Finally, submit the transaction to the network
      const stellarSubmit = await stellarServer.submitTransaction(transaction);

      const newAsset = await new Asset({ ...assetObject }).save();

      const end = performance.now();

      const elapsedTime = end - start;

      const fileSize = uploadedFile.size;

      const throughput = (fileSize * 8) / (elapsedTime / 1000) / 1024;
      const tps = transactions / (elapsedTime / 1000);
      console.log(`Transactions per second: ${tps.toFixed(2)}`);
      console.log(`Throughput: ${throughput.toFixed(2)} Mbps`);
      return {
        message: "Upload successfull",
        data: { stellar: stellarSubmit, asset: newAsset },
      };
    } catch (error) {
      console.log(error);
      return {
        message:
          "Stellar or MongoDb error when creating transaction on the asset!",
      };
    }
  },

  transferAsset: async (
    txId,
    keypairTo,
    metaData,
    keypairFrom,
    encryptionObject,
    fromSecretKey
  ) => {
    try {
      let tx = await chainConnection.getTransaction(txId);

      if (!tx) return { message: "Asset not found!!!" };

      //append the encrypted data in bigchain to the encryption object
      const encModel = tx.asset.data.model.encrypted_model;
      encryptionObject.encryptedData = encModel;

      //decrypt the asset object
      const decryptedFile = encryptor.asymmetricDecryption(
        encryptionObject,
        fromSecretKey
      );

      //Reencrypt the file
      const reEncryptFile = encryptor.symmetricEncryption(
        decryptedFile,
        fromSecretKey
      );
      tx.asset.data.model.encrypted_model = reEncryptFile;

      const txTransfer = BigchainDB.Transaction.makeTransferTransaction(
        [{ tx: tx, output_index: 0 }],
        [
          BigchainDB.Transaction.makeOutput(
            BigchainDB.Transaction.makeEd25519Condition(keypairTo.publicKey)
          ),
        ],
        metaData
      );

      const txTransferSigned = BigchainDB.Transaction.signTransaction(
        txTransfer,
        keypairFrom.privateKey
      );

      const postResponse = await chainConnection.postTransaction(
        txTransferSigned
      );
      const retrieveTransaction = await chainConnection.getTransaction(
        postResponse.id
      );
      return { retrieveTransaction: retrieveTransaction, tx: tx };
    } catch (err) {
      console.log(err);
      return { message: "Cannot tranfer asset!!!" };
    }
  },
};

export default ChainFunctions;
