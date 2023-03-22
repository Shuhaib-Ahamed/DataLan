import BigchainDB from "bigchaindb-driver";
import encryptor from "../utils/encryptor";
import { dev } from "../config";

//Big chain
const chainConnection = new BigchainDB.Connection(dev.bigchainURL);

//createSimpleAsset: creates and posts a new asset transaction on the blockchain,
//using the provided keypair, asset data, and metadata.
const createAsset = async (keypair, asset, metadata) => {
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
  return await chainConnection.postTransaction(txSigned);
};

const searchAndDecryptAsset = async (assetID, fromSecretKey) => {
  let foundAsset = await ChainFunctions.searchAssetById(assetID);
  let decryptedFile = null;

  if (foundAsset) {
    const encModel = foundAsset.asset.data.model.encrypted_model;
    return (decryptedFile = encryptor.symmetricDecryption(
      encModel,
      fromSecretKey
    ));
  }
};

const searchAssetById = async (assetID) => {
  return await chainConnection.getTransaction(assetID);
};

const searchAssetByMetadata = async (metadataKeyword) => {
  return await chainConnection.searchMetadata(metadataKeyword);
};

const assetService = {
  createAsset,
  searchAndDecryptAsset,
  searchAssetById,
  searchAssetByMetadata,
};

export default assetService;
