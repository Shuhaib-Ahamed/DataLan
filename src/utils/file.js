import { toast } from "react-toastify";
const fs = require("fs");

const writeToFile = (content) => {
  // Convert the keys to a string
  const keysString = `publicKey:${content.publicKey}\nsecretKey:${content.secretKey}`;

  // Create a Blob object from the keys string
  const blob = new Blob([keysString], { type: "text/plain" });

  // Create a download link for the Blob object
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "Credentials.nt";

  // Append the link to the document and click it to start the download
  document.body.appendChild(link);

  link.click();
  toast("File Downloaded!!!", { type: "success" });

  // Remove the link from the document
  document.body.removeChild(link);
};

const readFromFile = (file) => {
  // Read the contents of the file
  const keysString = fs.readFileSync(file, { encoding: "utf8" });

  // Split the string into an array of lines
  const keysArray = keysString.split("\n");

  // Parse the keys from the array
  const publicKey = keysArray[0].split(":")[1];
  const secretKey = keysArray[1].split(":")[1];

  return {
    publicKey: publicKey,
    secretKey: secretKey,
  };
};

const fileService = {
  writeToFile,
  readFromFile,
};

export default fileService;
