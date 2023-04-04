import { toast } from "react-toastify";
import encryptor from "./encryptor";
import { saveAs } from "file-saver";
import Papa from "papaparse";

const arrayBufferToString = (buffer) => {
  const uint8Array = new Uint8Array(buffer);
  const decoder = new TextDecoder();
  return decoder.decode(uint8Array);
};

const writeToCredFile = (content) => {
  // Convert the keys to a string
  const keysString = `publicKey:${content.publicKey}\nprivateKey:${content.privateKey}`;

  // Create a Blob object from the keys string
  const blob = new Blob([keysString], { type: "text/datalan" });

  // Create a download link for the Blob object
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "Credentials.nt";

  // Append the link to the document and click it to start the download
  document.body.appendChild(link);

  link.click();
  toast.success("File Downloaded!!!");

  // Remove the link from the document
  document.body.removeChild(link);
};

const readFromFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onabort = () => reject(new Error("file reading was aborted"));
    reader.onerror = () => reject(new Error("file reading has failed"));

    reader.onload = () => {
      const keysArray = arrayBufferToString(reader.result);
      const KeysArraySplit = keysArray.split("\n");
      const publicKey = KeysArraySplit[0].split(":")[1];
      const privateKey = KeysArraySplit[1].split(":")[1];
      resolve({
        publicKey: publicKey,
        privateKey: privateKey,
      });
    };
    reader.readAsArrayBuffer(file);
  });
};

async function byteArrayToFile(byteArray, fileName) {
  const blob = new Blob([byteArray], { type: "application/octet-stream" });
  return new File([blob], fileName);
}

// const byteArrayToFile = async (byteArray, fileName) => {
//   const blob = new Blob([byteArray], { type: "application/octet-stream" });
//   // Create a download link for the Blob object
//   const link = document.createElement("a");
//   link.href = window.URL.createObjectURL(blob);
//   link.download = fileName;

//   // Append the link to the document and click it to start the download
//   document.body.appendChild(link);

//   link.click();
//   toast.success("File Downloaded!!!");

//   // Remove the link from the document
//   document.body.removeChild(link);
// };

const readFile = (file) => {
  return new Promise((resolve, reject) => {
    // Create file reader
    let reader = new FileReader();

    // Register event listeners
    reader.addEventListener("loadend", (e) => resolve(e.target.result));
    reader.addEventListener("error", reject);

    // Read file
    reader.readAsArrayBuffer(file);
  });
};

const getAsByteArray = async (file) => {
  return new Uint8Array(await readFile(file));
};

const encryptAESFile = (file, privateKey) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const fileData = reader.result;

      const encryptedData = encryptor
        .symmetricEncryption(fileData, privateKey)
        .toString();
      resolve(encryptedData);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

const parseCSVFile = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rowsArray = [];
        results.data.map((d, index) => {
          if (index === 0) {
            rowsArray.push(Object.keys(d));
          }
        });
        const columns = rowsArray[0];
        const fileLength = results.data.length;
        resolve({ columns, fileLength });
      },
      error: function (err) {
        reject(err);
      },
    });
  });
};

const decryptAESFile = (encryptedData, privateKey, fileName) => {
  return new Promise((resolve, reject) => {
    try {
      const decryptedData = encryptor.symmetricDecryption(
        encryptedData,
        privateKey
      );
      const decryptedFile = new Blob([decryptedData], {
        type: "text/plain;charset=utf-8",
      });

      resolve(saveAs(decryptedFile, fileName));
    } catch (error) {
      reject(error);
    }
  });
};

const fileService = {
  writeToCredFile,
  readFromFile,
  readFile,
  getAsByteArray,
  byteArrayToFile,
  encryptAESFile,
  decryptAESFile,
  parseCSVFile,
};

export default fileService;
