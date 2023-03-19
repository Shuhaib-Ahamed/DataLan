import axios from "axios";

export const AddImageToIPFS = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post(
      "https://ipfs.infura.io:5001/api/v0/add",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (res === null) {
      throw Error("Failed to add data to IPFS");
    }
    return { ipfsHash: res.data.Hash, data: file };
  } catch (er) {
    console.log(er);
    throw new Error("Failed to add data to IPFS");
  }
};