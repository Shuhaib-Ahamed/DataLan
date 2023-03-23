import encryptor from "../../utils/encryptor";
import StellarSdk from "stellar-sdk";
import { dev } from "../../config";
import * as BigchainDB from "bigchaindb-driver";
import fileService from "../../utils/file";
import { setMessage } from "../../redux/slices/message";

const chainConnection = new BigchainDB.Connection(dev.bigchainURL);
const setllarConnection = new StellarSdk.Server(dev.setllarURL);

const uploadAsset = (file, metadata, setllarKeypair, dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(setMessage("Encryption data..."));
      const getByteArray = await fileService.getAsByteArray(file);

      // Create a keypair for the asset
      const bigChainKeyPair = new BigchainDB.Ed25519Keypair();

      // Encrypt the file
      const encryptedBuffer = encryptor.symmetricEncryption(
        JSON.stringify(getByteArray),
        setllarKeypair.privateKey
      );

      // Convert the encrypted data to a Blob
      const encryptedBlob = new Blob([encryptedBuffer], { type: file.type });

      //Decrypt the file with the owners private key
      const asset = {
        data: {
          model: {
            asset_type: "digital_asset",
            asset_issuer: "AutoCS platform",
            encrypted_model: encryptedBlob,
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
      dispatch(setMessage("Submiting stellar transaction..."));
      const response = await setllarConnection.submitTransaction(transaction);

      //encrypt the assetData

      // constains AssetID , bgiChainAssetKeypair
      const encryptedAssetData = encryptor.symmetricEncryption(
        JSON.stringify(newAsset),
        setllarKeypair.privateKey
      );

      resolve({
        assetData: encryptedAssetData,
        response: response,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const chainService = {
  uploadAsset,
};

export default chainService;
