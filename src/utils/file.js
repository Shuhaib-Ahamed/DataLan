import { toast } from "react-toastify";

const arrayBufferToString = (buffer) => {
  const uint8Array = new Uint8Array(buffer);
  const decoder = new TextDecoder();
  return decoder.decode(uint8Array);
};

const writeToFile = (content) => {
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

const fileService = {
  writeToFile,
  readFromFile,
};

export default fileService;
