import BigchainDB from "bigchaindb-driver";
import encryptor from "../utils/encryptor";
import StellarSdk from "stellar-sdk";
import { dev } from "../config";

const chainConnection = new BigchainDB.Connection(dev.bigchainURL);

const uploadAsset = (file, metadata, setllarKeypair) => {
  return new Promise(async (resolve, reject) => {
    try {
      const bigChainKeyPair = new BigchainDB.Ed25519Keypair();

      //Decrypt the file with the owners private key
      const asset = {
        data: {
          model: {
            encrypted_model: encryptor.symmetricEncryption(
              JSON.stringify(file),
              setllarKeypair.privateKey
            ),
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

      const tx = await chainConnection.postTransaction(txSigned);

      const server = new StellarSdk.Server(dev.setllarURL);

      //Get stellar account
      const account = await server.loadAccount(setllarKeypair.publicKey);

      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.manageData({
            name: tx.id,
            value: bigChainKeyPair.privateKey,
          })
        )
        .setTimeout(0)
        .build();

      transaction.sign(setllarKeypair);

      await server.submitTransaction(transaction);

      resolve({
        assetId: tx.id,
        assetKeyPair: bigChainKeyPair,
      });
    } catch (error) {
      reject(error);
    }
  });
};

// // Usage example
// uploadAssetPromise(file, metadata, setllarKeypair)
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

const chainService = {
  uploadAsset,
};

export default chainService;
