import StellarSdk from "stellar-sdk";
import BigchainDB from "bigchaindb-driver";
import encryptor from "../../utils/encrypt.js";
import ChainFunctions from "../../utils/chainLogic.js";
import { NETWORKS } from "../../utils/networks.js";
import Asset from "../models/asset.model.js";
import Requests from "../models/requests.model.js";
import User from "../models/user.model.js";
import { ENCRYPTION, REQUEST_STATUS, STATE } from "../../utils/enums.js";
import { failed, success } from "../../utils/responseApi.js";

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

    const start = performance.now();
    let transactions = 0;

    let metadata = {};
    for (let key of Object.keys(formData)) {
      metadata[key] = formData[key];
    }
    //delete privateKey and publicKey and add encryptionData
    delete metadata.fromSecretKey;

    const uploadData = {
      fromSecretKey: fromSecretKey,
      fromPublicKey: toPublicKey,
      toPublicKey: toPublicKey,
      metadata: metadata,
      uploadedFile: uploadedFile,
      type: ENCRYPTION.AES,
    };

    return await ChainFunctions.upload(
      uploadData,
      stellarServer,
      start,
      transactions
    );
  },

  decryptAssetObject: async (body) => {
    var decryptedResult;
    const { key, fromSecretKey, type } = body;
    if (type === ENCRYPTION.AES) {
      decryptedResult = encryptor.symmetricDecryption(key, fromSecretKey);
    } else if (type === ENCRYPTION.RSA) {
      // const encyptionObject = JSON.parse(key);

      decryptedResult = encryptor.asymmetricDecryption(
        {
          nonce: "pOkVzazpAwY9MF6R0Di/bfXop56i3eTG",
          encryptedData:
            "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",
          receiverPublicKey:
            "GBTTUWNPQENXYBTFS2SLEJ6WUCAHAYWROJZBNNQO5QMXNTPKESXVA5OJ",
          senderPublicKey:
            "GCVREGVI4MO7HN3SHOGOOHG3HGQFYHNKCFNASEHWTUYYMDNNS3W7RAXT",
        },
        fromSecretKey
      );
    } else {
      return { message: "Please provide encryption type!!!" };
    }

    let response = "";
    const regex = /^[\],:{}\s]*$/;
    const isJSON = regex.test(
      decryptedResult
        .replace(/\\["\\\/bfnrtu]/g, "@")
        .replace(
          /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
          "]"
        )
        .replace(/(?:^|:|,)(?:\s*\[)+/g, "")
    );
    if (isJSON) {
      response = JSON.parse(decryptedResult);
    } else {
      response = decryptedResult;
    }

    return response;
  },

  searchAndDecryptAsset: async (req) => {
    let transferResult = await ChainFunctions.searchAndDecryptAsset(req.body);

    if (!transferResult) {
      return {
        message: "Asset Not Found!!",
      };
    }

    const response = transferResult;

    return { message: "Decrypted Asset", response };
  },

  searchAssetById: async (body) => {
    const formData = body;
    if (!formData.assetID) return;

    let transferResult = await ChainFunctions.searchAssetById(formData.assetID);

    if (!transferResult) {
      return {
        message: `"error when getting asset with id= " + ${formData.assetID}`,
      };
    }

    return { message: "Fetched Asset", data: transferResult };
  },

  searchAssetByMetadata: async (body) => {
    const formData = body;
    if (!formData.metadataKeyword) return;

    let transferResult = await ChainFunctions.searchAssetByMetadata(
      formData.metadataKeyword
    );

    if (transferResult.isErr) {
      return {
        message: `"error when getting asset with metadata: " + ${formData.metadataKeyword}`,
      };
    }

    const response = transferResult.res;

    return { message: "Fetched Asset", response };
  },

  //Buyer
  sendAssetRequest: async (req, res) => {
    const body = req.body;
    try {
      const { fromPublicKey, toPublicKey, assetId } = body;
      //set request status
      body.status = REQUEST_STATUS.INREVIEW;

      const publicKeys = [toPublicKey, fromPublicKey];
      const users = await User.find({ publicKey: { $in: publicKeys } });

      const asset = await Asset.findOne({
        $and: [{ _id: assetId }, { publicKey: toPublicKey }],
      });

      if (users.length <= 1 || !asset) {
        return failed(res, 404, "User or Asset dose not exist!");
      }

      //save object in mongo
      const response = await new Requests({ ...body }).save();

      return success(res, 201, response);
    } catch (error) {
      console.log(error);
      if (error.code === 11000) {
        return failed(res, 400, "Asset transfer is already on request!");
      } else return failed(res, 400, "Mongo Error!");
    }
  },

  //Seller
  acceptAssetRequest: async (body) => {
    let { fromSecretKey, toPublicKey, fromPublicKey, requestID } = body;

    const request = await Requests.findById(requestID);
    if (!request) return { message: "Request not found!!!" };

    if (request.status === REQUEST_STATUS.GRANTED)
      return { message: "Asset access already granted!!!" };

    const response = await Asset.findOne({ _id: request?.assetObjectID });

    if (!response) return { message: "Asset not found!!!" };

    if (response.status === STATE.TRANSFERED)
      return { message: "Asset already transfered!!!" };

    //decrypt assetData from MongoDB
    const decryptedAssetData = encryptor.symmetricDecryption(
      response?.assetData,
      fromSecretKey
    );

    const { assetID } = JSON.parse(decryptedAssetData);

    //get asset by ID
    let decryptedAsset = await ChainFunctions.searchAndDecryptAsset({
      assetID,
      fromSecretKey,
    });

    //Upload Asset
    let uploadAsset = await ChainFunctions.upload(
      {
        fromSecretKey: fromSecretKey,
        fromPublicKey: fromPublicKey,
        uploadedFile: decryptedAsset,
        metadata: JSON.parse(decryptedAssetData),
        toPublicKey: toPublicKey,
        type: ENCRYPTION.RSA,
      },
      stellarServer
    );

    if (!uploadAsset.data.stellar) {
      return {
        message: "Failed to upload asset!!!",
      };
    }

    await Requests.findByIdAndUpdate(
      requestID,
      {
        $set: {
          status: REQUEST_STATUS.GRANTED,
          assetObjectID: uploadAsset.data.asset._id,
        },
      },
      { new: true }
    );

    return {
      message: "Request Accepted!",
      data: uploadAsset.data,
    };
  },

  //Buyer
  transferAsset: async (data) => {
    let {
      fromPublicKey,
      fromSecretKey,
      metadata,
      requestID,
      toPublicKey,
      receiverComment,
    } = data;

    try {
      const senderKeyPair = getKeypairFromChain;

      if (receiverComment.length > 28)
        return { message: "Memo should be less than 28 characters" };

      const request = await Requests.findById(requestID);
      if (!request) return { message: "Request not found!!!" };

      if (request.status === REQUEST_STATUS.INREVIEW)
        return { message: "Asset access in review!!!" };

      const response = await Asset.findOne({ _id: request?.assetObjectID });

      if (!response) return { message: "Asset not found!!!" };

      if (response.status === STATE.OWNED)
        return { message: "Asset is not transfered!!!" };

      //decrypt assetData
      const decryptedAssetData = encryptor.asymmetricDecryption(
        JSON.parse(response?.assetData),
        fromSecretKey
      );

      const { assetID, encryptioObject, assetKeyPair } =
        JSON.parse(decryptedAssetData);

      //txId, keypairTo, metaData, keypairFrom;
      const transferResult = await ChainFunctions.transferAsset(
        assetID,
        senderKeyPair,
        metadata,
        assetKeyPair,
        encryptioObject,
        fromSecretKey
      );

      if (!transferResult.retrieveTransaction)
        return { message: "Error when transfering asset!" };

      // Next, you'll need to load the account that you want to transfer data to
      const sourceKeypair = StellarSdk.Keypair.fromSecret(fromSecretKey);
      const sourceAccount = await stellarServer.loadAccount(
        sourceKeypair.publicKey()
      );

      // Then, you can create a transaction to add data to the account
      const stellarTrnsaction = new StellarSdk.TransactionBuilder(
        sourceAccount,
        {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: StellarSdk.Networks.TESTNET,
        }
      )
        .addOperation(
          StellarSdk.Operation.manageData({
            name: transferResult.tx.metadata.assetTitle,
            value: encryptor.generateHash(
              JSON.stringify({
                assetTitle: transferResult.tx.metadata.assetTitle,
                assetDescription: transferResult.tx.metadata.assetDescription,
                assetID: transferResult.tx.asset.id,
                assetKeyPair: decryptedAssetData.assetKeyPair,
                assetPrice: transferResult.tx.metadata.assetPrice,
              })
            ),
          })
        )
        .setTimeout(30)
        .addOperation(
          StellarSdk.Operation.payment({
            destination: toPublicKey,
            asset: StellarSdk.Asset.native(),
            amount: transferResult.tx.metadata.assetPrice, // deduct the asset price from the destination account
          })
        )
        .addMemo(StellarSdk.Memo.text(receiverComment))
        .build();

      // Sign the transaction with the account's secret key
      stellarTrnsaction.sign(sourceKeypair);

      const encryptedAssetData = encryptor.symmetricEncryption(
        JSON.stringify({
          assetTitle: transferResult.tx.metadata.assetTitle,
          assetDescription: transferResult.tx.metadata.assetDescription,
          assetID: transferResult.tx.asset.id,
          assetKeyPair: decryptedAssetData.assetKeyPair,
          assetPrice: transferResult.tx.metadata.assetPrice,
        }),
        fromSecretKey
      );

      await Asset.findByIdAndUpdate(
        request.assetObjectID,
        {
          $set: {
            publicKey: fromPublicKey,
            status: STATE.OWNED,
            assetData: encryptedAssetData,
            encryptionType: ENCRYPTION.AES,
          },
        },
        {
          new: true,
        }
      );

      // Finally, submit the transaction to the network
      const stellarSubmit = await stellarServer.submitTransaction(
        stellarTrnsaction
      );

      return {
        message: "Transfer successfull",
        data: {
          stellar: stellarSubmit,
          chain: transferResult,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Mongo or Stellar or Bigchain Error!!!",
      };
    }
  },
};
