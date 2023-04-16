const getAccountById = async (publicKey, server) => {
  return await server.loadAccount(publicKey);
};

const getPaymentByPublicKey = async (publicKey, server) => {
  return await server.payments().forAccount(publicKey).call();
};

const getTransactionById = async (txID, server) => {
  return await server.transactions().transaction(txID).call();
};

const stellarService = {
  getTransactionById,
  getAccountById,
  getPaymentByPublicKey,
};

export default stellarService;
