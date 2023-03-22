import { NIFTRON } from "niftron-client-sdk";
// import RSAProxyReencrypt from "rsa-proxy-reencrypt";

export default {
  //   generateSalt: () => {
  //     return crypto.randomBytes(128).toString("base64");
  //   },

  asymmetricEncryption: (field, toPublicKey, fromSecretKey) => {
    const asymmetricEncryption = new NIFTRON.utils.asymmetricEncryption();
    const response = asymmetricEncryption.encrypt(
      field,
      toPublicKey,
      fromSecretKey
    );

    return response;
  },

  asymmetricDecryption: (encryptionObject, toSecretKey) => {
    const asymmetricEncryption = new NIFTRON.utils.asymmetricEncryption();
    const response = asymmetricEncryption.decrypt(
      encryptionObject,
      toSecretKey
    );
    return response;
  },

  // --- Symmetric encryption/decryption --- //

  symmetricEncryption: (field, fromSecretKey) => {
    const response = NIFTRON.utils.symmetricEncryption.encrypt(
      field,
      fromSecretKey
    );
    return response;
  },
  symmetricDecryption: (encryptedField, fromSecretKey) => {
    const response = NIFTRON.utils.symmetricEncryption.decrypt(
      encryptedField,
      fromSecretKey
    );
    return response;
  },

  generateHash: (value) => {
    return crypto.createHash("sha256").update(value).digest("hex");
  },

  //   proxyEncrypt: (field, fromSecretKey, toPublicKey) => {
  //     const fromEncrypter = new RSAProxyReencrypt({
  //       rsa: { privateKey: fromSecretKey },
  //     });
  //     const { proxyKey, userKey } =
  //       fromEncrypter.generateReencryptionKey(toPublicKey);
  //     const toChipherText = fromEncrypter.encrypt(field);

  //     return { proxyKey, userKey, toChipherText };
  //   },

  //   proxyReEncrypt: (proxyKey, chipherText) => {
  //     const proxyEncrypter = new RSAProxyReencrypt({
  //       rsa: { privateKey: proxyKey },
  //     });

  //     //decryptable cipher -> user
  //     const toCipherText = proxyEncrypter.decrypt(chipherText, {
  //       partial: true,
  //     });
  //     return { toCipherText };
  //   },

  //   proxyDeCrypt: (fromSecretKey, toCipherText) => {
  //     const toEncrypter = new RSAProxyReencrypt({
  //       //Users SecretKey
  //       rsa: { privateKey: fromSecretKey },
  //     });
  //     const decryptedField = toEncrypter.decrypt(toCipherText);
  //     return { decryptedField };
  //   },
};
