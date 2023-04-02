import encryptor from "../../utils/encryptor";
import StellarSdk from "stellar-sdk";
import { dev } from "../../config";
import * as BigchainDB from "bigchaindb-driver";
import fileService from "../../utils/file";
import { setMessage } from "../../redux/slices/message";
import { ENCRYPTION, STATE } from "../../enum";
import requestService from "../request/requestService";
import assetService from "../asset/assetService";
import { v4 as uuidv4 } from "uuid";

const chainConnection = new BigchainDB.Connection(dev.bigchainURL);
const setllarConnection = new StellarSdk.Server(dev.setllarURL);

const uploadAsset = (
  file,
  metadata,
  setllarKeypair,
  type,
  dispatch,
  fromPublicKey
) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Create a keypair for the asset
      const bigChainKeyPair = new BigchainDB.Ed25519Keypair();
      let getByteArray = null;
      let encryptedBuffer = null;
      let encryptedAssetData = null;

      if (type === ENCRYPTION.AES) {
        getByteArray = await fileService.getAsByteArray(file);
      }

      // Encrypt the file
      if (type === ENCRYPTION.AES) {
        encryptedBuffer = encryptor.symmetricEncryption(
          JSON.stringify(getByteArray),
          setllarKeypair.privateKey
        );
      } else if (type === ENCRYPTION.RSA) {
        encryptedBuffer = encryptor.asymmetricEncryption(
          file,
          fromPublicKey,
          setllarKeypair.privateKey
        );
      }
      // Convert the encrypted data to a Blob
      // const encryptedBlob = new Blob([encryptedBuffer], { type: file.type });

      //Decrypt the file with the owners private key
      const asset = {
        data: {
          model: {
            asset_type: "digital_asset",
            asset_issuer: "AutoCS platform",
            encrypted_model:
              type === ENCRYPTION.AES
                ? encryptedBuffer
                : encryptedBuffer.encryptedData,
          },
        },
      };

      // Create a transaction
      const txSimpleAsset = BigchainDB.Transaction.makeCreateTransaction(
        asset,
        metadata,
        [
          BigchainDB.Transaction.makeOutput(
            BigchainDB.Transaction.makeEd25519Condition(
              bigChainKeyPair.publicKey
            )
          ),
        ],
        bigChainKeyPair.publicKey
      );

      // Sign the transaction with private keys
      const txSigned = BigchainDB.Transaction.signTransaction(
        txSimpleAsset,
        bigChainKeyPair.privateKey
      );

      dispatch(setMessage("Signing Bigchain transaction..."));
      const tx = await chainConnection.postTransaction(txSigned);

      const newAsset = {
        assetId: tx.id,
        assetKeyPair: bigChainKeyPair,
      };

      if (type === ENCRYPTION.RSA) {
        delete encryptedBuffer.encryptedData;
        newAsset.encriptionObject = encryptedBuffer;
      }

      // Next, you'll need to load the account that you want to add data to
      const sourceKeypair = StellarSdk.Keypair.fromSecret(
        setllarKeypair.privateKey
      );

      dispatch(setMessage("Loading Stellar account..."));
      const sourceAccount = await setllarConnection.loadAccount(
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
            value: encryptor.generateHash(JSON.stringify(newAsset)),
          })
        )
        .setTimeout(30)
        .build();

      // Sign the transaction with the account's secret key
      transaction.sign(sourceKeypair);

      // Finally, submit the transaction to the network
      dispatch(setMessage("Submiting Stellar transaction..."));
      const response = await setllarConnection.submitTransaction(transaction);

      //encrypt the assetData

      // constains AssetID , bgiChainAssetKeypair
      if (type === ENCRYPTION.RSA) {
        encryptedAssetData = encryptor.asymmetricEncryption(
          JSON.stringify(newAsset),
          fromPublicKey,
          setllarKeypair.privateKey
        );
      } else if (type === ENCRYPTION.AES) {
        encryptedAssetData = encryptor.symmetricEncryption(
          JSON.stringify(newAsset),
          setllarKeypair.privateKey
        );
      }

      resolve({
        assetData: encryptedAssetData,
        response: response,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const searchAssetById = async (assetID) => {
  return await chainConnection.getTransaction(assetID);
};

const searchAndDecryptAsset = async (body) => {
  const { assetID, fromSecretKey } = body;

  let foundAsset = await searchAssetById(assetID);
  let decryptedFile = null;

  if (foundAsset) {
    const encModel = foundAsset.asset.data.model.encrypted_model;
    decryptedFile = encryptor.symmetricDecryption(encModel, fromSecretKey);
  }
  return decryptedFile;
};

const initiateTransferAsset = (
  requestId,
  assetId,
  txID,
  setllarKeypair,
  toPublicKey,
  dispatch
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let getAssetByID = await chainConnection.getTransaction(txID);

      const metadata = getAssetByID?.metadata;
      metadata.assetTitle = metadata.assetTitle.split("-")[0] + "-" + uuidv4();

      const encModel = getAssetByID.asset.data.data.model.encrypted_model;
      const decryptedBuffer = encryptor.symmetricDecryption(
        encModel,
        setllarKeypair.privateKey
      );

      const uploadedResponse = await uploadAsset(
        decryptedBuffer,
        metadata,
        setllarKeypair,
        ENCRYPTION.RSA,
        dispatch,
        toPublicKey
      );

      const newAsset = {
        txID: uploadedResponse.response.id,
        publicKey: toPublicKey,
        assetData: JSON.stringify(uploadedResponse.assetData),
        ...metadata,
        status: STATE.TRANSFERED,
        encryptionType: ENCRYPTION.RSA,
        originalAssetId: assetId,
      };

      dispatch(setMessage("Creating an asset!!!"));
      const assetResponse = await assetService.createAsset(newAsset);

      dispatch(setMessage("Updating request!!!"));
      const response = await requestService.acceptAndUpdateAssetRequest(
        requestId,
        {
          assetId: assetResponse?._id,
        }
      );

      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};
const transferAsset = (assetData, fromKeyPair, metaData, dispatch) => {
  const senderKeyPair = new BigchainDB.Ed25519Keypair();

  dispatch(setMessage("Encrypting Data!!!"));

  const encryptedAssetData = JSON.parse(assetData);

  //decrypt assetData
  const decryptedAssetData = encryptor.asymmetricDecryption(
    encryptedAssetData,
    fromKeyPair?.privateKey
  );

  const { assetId, assetKeyPair, encriptionObject } =
    JSON.parse(decryptedAssetData);

  return new Promise(async (resolve, reject) => {
    try {
      dispatch(setMessage("Fetching asset from BigchainDB!!!"));
      let tx = await chainConnection.getTransaction(assetId);

      if (!tx) throw new Error("Asset not found!!!");

      //append the encrypted data in bigchain to the encryption object
      const encModel = tx?.asset.data.data.model.encrypted_model;
      encriptionObject.encryptedData = encModel;

      //decrypt the asset object
      const decryptedFile = encryptor.asymmetricDecryption(
        encriptionObject,
        fromKeyPair?.privateKey
      );

      //Reencrypt the file
      const reEncryptFile = encryptor.symmetricEncryption(
        decryptedFile,
        fromKeyPair?.privateKey
      );
      tx.asset.data.data.model.encrypted_model = reEncryptFile;

      const txTransfer = BigchainDB.Transaction.makeTransferTransaction(
        [{ tx: tx, output_index: 0 }],
        [
          BigchainDB.Transaction.makeOutput(
            BigchainDB.Transaction.makeEd25519Condition(senderKeyPair.publicKey)
          ),
        ],
        metaData
      );

      const txTransferSigned = BigchainDB.Transaction.signTransaction(
        txTransfer,
        assetKeyPair.privateKey
      );

      const postResponse = await chainConnection.postTransaction(
        txTransferSigned
      );
      dispatch(setMessage("Retrieving transaction!!!"));
      const retrieveTransaction = await chainConnection.getTransaction(
        postResponse.id
      );

      if (!retrieveTransaction) throw new Error("Transaction not found!!!");

      const newAsset = {
        assetId: retrieveTransaction.id,
        assetKeyPair: senderKeyPair,
      };

      // Next, you'll need to load the account that you want to add data to
      const sourceKeypair = StellarSdk.Keypair.fromSecret(
        fromKeyPair.privateKey
      );

      dispatch(setMessage("Loading Stellar account..."));
      const sourceAccount = await setllarConnection.loadAccount(
        sourceKeypair.publicKey()
      );

      // Then, you can create a transaction to add data to the account
      var transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.manageData({
            name: metaData.assetTitle,
            value: encryptor.generateHash(JSON.stringify(newAsset)),
          })
        )
        .setTimeout(30)
        .addOperation(
          StellarSdk.Operation.payment({
            destination: fromKeyPair.publicKey,
            asset: StellarSdk.Asset.native(),
            amount: metaData.assetAmount.toString(), // deduct the asset price from the destination account
          })
        )
        .build();

      // Sign the transaction with the account's secret key
      transaction.sign(sourceKeypair);

      const encryptedAssetData = encryptor.symmetricEncryption(
        JSON.stringify(newAsset),
        fromKeyPair.privateKey
      );

      // Finally, submit the transaction to the network
      dispatch(setMessage("Signing transaction..."));
      const response = await setllarConnection.submitTransaction(transaction);

      resolve({ assetData: encryptedAssetData, response: response });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

const chainService = {
  uploadAsset,
  initiateTransferAsset,
  searchAndDecryptAsset,
  transferAsset,
};

export default chainService;
