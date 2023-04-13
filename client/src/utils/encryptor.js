import { NIFTRON } from "niftron-client-sdk";
// import RSAProxyReencrypt from "rsa-proxy-reencrypt";
import crypto from "crypto";

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

  isJSON: (value) => {
    const regex = /^[\],:{}\s]*$/;
    regex.test(
      value
        .replace(/\\["\\\/bfnrtu]/g, "@")
        .replace(
          /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
          "]"
        )
        .replace(/(?:^|:|,)(?:\s*\[)+/g, "")
    );
    return regex;
  },

};
