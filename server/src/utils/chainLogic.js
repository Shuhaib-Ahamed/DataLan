import BigchainDB from "bigchaindb-driver";
import chainService from "../api/chain/chain.service.js";
import encryptor from "./encrypt.js";
const API_PATH = process.env.BIG_CHAIN_NET;
const chainConnection = new BigchainDB.Connection(API_PATH);

let chainFunctions = {
  createAsset: async (req) => {
    console.log(req);
    const uploadedFile = req.file;
    const formData = req.body;

    let metadata = {};
    for (let key of Object.keys(formData)) {
      metadata[key] = formData[key];
    }

    const keypair = await chainService.getKeyPair();

    const assetdata = {
      model: {
        asset_type: "digital_asset",
        asset_issuer: "AutoCS platform",
      },
    };

    let cypher = encryptor.symmetricEncryption(
      JSON.stringify(uploadedFile),
      metadata.fromSecretKey
    );

    let cypherStringified = cypher.toString();
    assetdata.model.encrypted_model = cypherStringified;

    //delete privateKey and publicKey and add encryptionData
    delete metadata.fromSecretKey;
    delete metadata.file;

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

    try {
      chainSigned = await chainConnection.postTransaction(txSigned); //or USE: searchAssets OR pollStatusAndFetchTransaction

      var result = {
        chainResponse: chainSigned,
        assetKeyPair: keypair,
        assetdata: assetdata,
      };
    } catch (err) {
      console.log("error", err);
    }

    return result;
  },

  searchAndDecryptAsset: async (body) => {
    const { assetID, fromSecretKey } = body;

    let foundAsset = await chainFunctions.searchAssetById(assetID);
    let decryptedFile = null;

    if (foundAsset.res && !foundAsset.isErr) {
      const encModel = foundAsset.res.asset.data.model.encrypted_model;

      decryptedFile = encryptor.symmetricDecryption(encModel, fromSecretKey);

      foundAsset.res.asset = JSON.parse(decryptedFile);
    }
    return foundAsset.res;
  },

  searchAssetById: async (assetID) => {
    let assetObj = null;
    let result = { isErr: false, res: assetObj };

    try {
      assetObj = await chainConnection.getTransaction(assetID); //or USE: searchAssets OR pollStatusAndFetchTransaction
    } catch (err) {
      result.isErr = true;
      return result;
    }

    result.isErr = false;
    result.res = assetObj;
    return result;
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
  transferAsset: async (
    fetchedAsset,
    senderKeypair,
    metaData,
    issureKeyPair
  ) => {
    let assetObj = null;
    let result = { isErr: false, res: assetObj };

    if (fetchedAsset) {
      //Transfer the Asset
      const txTransfer = BigchainDB.Transaction.makeTransferTransaction(
        // signedTx to transfer and output index
        [{ tx: fetchedAsset, output_index: 0 }],
        [
          BigchainDB.Transaction.makeOutput(
            BigchainDB.Transaction.makeEd25519Condition(senderKeypair.publicKey)
          ),
        ],
        // metadata
        metaData
      );

      // Sign the transaction with private keys
      const txSigned = BigchainDB.Transaction.signTransaction(
        txTransfer,
        issureKeyPair.privateKey
      );

      try {
        assetObj = await chainConnection.postTransaction(txSigned); //or USE: searchAssets OR pollStatusAndFetchTransaction
      } catch (err) {
        result.isErr = true;
        return result;
      }

      result.isErr = false;
      result.res = assetObj;
      return result;
    }
  },
};

export default chainFunctions;
