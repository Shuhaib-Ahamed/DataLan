import {
  BadRequestException,
  NotFoundException,
} from "../../utils/apiErrors.js";
import StellarSdk from "stellar-sdk";

var setllarServer = new StellarSdk.Server(
  "https://horizon-testnet.stellar.org"
);

export default {
  sendPayment: async (body) => {
    var { secretKey, destinationId, amount, memo } = body;
    var sourceKeys = StellarSdk.Keypair.fromSecret(secretKey);
    // Transaction will hold a built transaction we can resubmit if the result is unknown.
    var transaction;

    // First, check to make sure that the destination account exists.
    // You could skip this, but if the account does not exist, you will be charged
    // the transaction fee when the transaction fails.
    const steallarResponse = await setllarServer
      .loadAccount(destinationId)
      // If the account is not found, surface a nicer error message for logging.
      .catch(function (error) {
        if (error instanceof StellarSdk.NotFoundError) {
          throw new NotFoundException(
            "The destination account does not exist!"
          );
        } else return error;
      })
      // If there was no error, load up-to-date information on your account.
      .then(function () {
        return setllarServer.loadAccount(sourceKeys.publicKey());
      })
      .then(async function (sourceAccount) {
        // Start building the transaction.
        transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
          timebounds: await setllarServer.fetchTimebounds(100),
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: StellarSdk.Networks.TESTNET,
        })
          .addOperation(
            StellarSdk.Operation.payment({
              destination: destinationId,
              // Because Stellar allows transaction in many currencies, you must
              // specify the asset type. The special "native" asset represents Lumens.
              asset: StellarSdk.Asset.native(),
              amount: amount,
            })
          )
          // A memo allows you to add your own metadata to a transaction. It's
          // optional and does not affect how Stellar treats the transaction.
          .addMemo(StellarSdk.Memo.text(memo))
          // Wait a maximum of three minutes for the transaction
          .setTimeout(180)
          .build();
        // Sign the transaction to prove you are actually the person sending it.
        transaction.sign(sourceKeys);
        // And finally, send it off to Stellar!
        return setllarServer.submitTransaction(transaction);
      })
      .then(function (result) {
        return result;
      })
      .catch(function (error) {
        throw new BadRequestException("Something went wrong!");
        // If the result is unknown (no response body, timeout etc.) we simply resubmit
        // already built transaction:
        // server.submitTransaction(transaction);
      });

    return steallarResponse;
  },

  getAllPayments: async (accountID) => {
    // Create an API call to query payments involving the account.
    var payments = setllarServer.payments().forAccount(accountID);
    return payments;
  },
};
