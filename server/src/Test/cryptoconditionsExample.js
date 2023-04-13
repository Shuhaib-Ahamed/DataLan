const Buffer = require('buffer').Buffer
const BigchainDB = require('bigchaindb-driver')
const base58 = require('bs58')
const cryptoconditions = require('crypto-conditions')

const user1 = new BigchainDB.Ed25519Keypair()
const user2 = new BigchainDB.Ed25519Keypair()
const user3 = new BigchainDB.Ed25519Keypair()
const creator = new BigchainDB.Ed25519Keypair()
const receiver = new BigchainDB.Ed25519Keypair()

const API_PATH = process.env.BIG_CHAIN_NET;
const conn = new BigchainDB.Connection(API_PATH, {
    app_id: 'xxxxxxxx',
    app_key: 'xxxxxxxxxxxxxxxxxxx'
})

console.log(BigchainDB.Transaction.makeEd25519Condition(user1.publicKey))
// at the output of the transaction to-be-spent
// Generate threshold condition 2 out of 3
const threshold = 2
const condition1 = BigchainDB.Transaction.makeEd25519Condition(user1.publicKey, false)
const condition2 = BigchainDB.Transaction.makeEd25519Condition(user2.publicKey, false)
const condition3 = BigchainDB.Transaction.makeEd25519Condition(user3.publicKey, false)

const thresholdCondition = BigchainDB.Transaction.makeThresholdCondition(threshold, [condition1, condition2, condition3])

console.log(thresholdCondition)
let output = BigchainDB.Transaction.makeOutput(thresholdCondition);
output.public_keys = [user1.publicKey, user2.publicKey, user3.publicKey];

const tx = BigchainDB.Transaction.makeCreateTransaction({
        data: 'payload'
    }, {
        metadata: 'test'
    }, [output],
    creator.publicKey
)


// Sign the transaction with private keys
const txSigned = BigchainDB.Transaction.signTransaction(tx, creator.privateKey)

// Send the transaction off to BigchainDB
conn.postTransaction(txSigned)
    .then(() => conn.pollStatusAndFetchTransaction(txSigned.id))
    .then(res => {
        console.log('Create Transaction', txSigned.id, 'accepted')
        const elem = document.getElementById('lastTransaction')
        elem.href = API_PATH + 'transactions/' + txSigned.id
        elem.innerText = txSigned.id
        btn.disabled = false
    })


const btn = document.getElementById('btn-transfer')
btn.onclick = function() {

    let createTranfer = BigchainDB.Transaction.makeTransferTransaction(
      [{ tx: txSigned,
        output_index: 0
     }],
      [BigchainDB.Transaction.makeOutput(
            BigchainDB.Transaction.makeEd25519Condition(receiver.publicKey))],
      {
          what: "Transfer transaction"
      }
    );


    // at the input of the spending transaction
    let fulfillment1 = BigchainDB.Transaction.makeEd25519Condition(user1.publicKey, false)
    let fulfillment2 = BigchainDB.Transaction.makeEd25519Condition(user2.publicKey, false)
    fulfillment1.sign(
        new Buffer(BigchainDB.Transaction.serializeTransactionIntoCanonicalString(createTranfer)),
        new Buffer(base58.decode(user1.privateKey))
    );
    fulfillment2.sign(
        new Buffer(BigchainDB.Transaction.serializeTransactionIntoCanonicalString(createTranfer)),
        new Buffer(base58.decode(user2.privateKey))
    );

    // 2 out of 3 need to sign the fulfillment. Still condition3 is needed as the "circuit definition" is needed.
    // See https://github.com/bigchaindb/cryptoconditions/issues/94
    let fulfillment = new cryptoconditions.ThresholdSha256()
    fulfillment.threshold = 2
    fulfillment.addSubfulfillment(fulfillment1.serializeUri())
    fulfillment.addSubfulfillment(fulfillment2.serializeUri())
    fulfillment.addSubconditionUri(condition3.getConditionUri())

		//Sign the transaction
    const fulfillmentUri = fulfillment.serializeUri()
    createTranfer.inputs[0].fulfillment = fulfillmentUri

    conn.postTransaction(createTranfer)
        .then(() => conn.pollStatusAndFetchTransaction(createTranfer.id))
        .then(res => {
          	const transfTransaction = document.getElementById('transfTransaction')
            transfTransaction.href = API_PATH + 'transactions/' + createTranfer.id
            transfTransaction.innerText = createTranfer.id
            console.log('Transfer Transaction', createTranfer.id, 'accepted')
        })


}
