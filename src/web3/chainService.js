import encryptor from "../utils/encryptor";
import StellarSdk from "stellar-sdk";
import { dev } from "../config";
import * as BigchainDB from "bigchaindb-driver";
import { v4 as uuidv4 } from "uuid";

const chainConnection = new BigchainDB.Connection(dev.bigchainURL);
const setllarConnection = new StellarSdk.Server(dev.setllarURL);

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

      const newAsset = {
        assetId: tx.id,
        assetKeyPair: bigChainKeyPair,
      };

      // Next, you'll need to load the account that you want to add data to
      const sourceKeypair = StellarSdk.Keypair.fromSecret(
        setllarKeypair.privateKey
      );
      
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
            name: metadata.assetTitle + uuidv4(),
            value: encryptor.generateHash(JSON.stringify(newAsset)),
          })
        )
        .setTimeout(30)
        .build();

      // Sign the transaction with the account's secret key
      transaction.sign(sourceKeypair);

      // Finally, submit the transaction to the network
      const result = await setllarConnection.submitTransaction(transaction);

      resolve({
        asset: newAsset,
        stellar: result,
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
