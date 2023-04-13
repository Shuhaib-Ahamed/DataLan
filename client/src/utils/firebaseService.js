import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { toast } from "react-toastify";
import storage from "../firebaseConfig";
import { v4 as uuidv4 } from "uuid";

export const uploadFile = async (file, userID) => {
  return new Promise((resolve, reject) => {
    const newName = uuidv4() + "." + file.name.split(".").pop();

    const storageRef = ref(storage, `/profiles/${userID}/${newName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      (err) => {
        toast.error("Error uploading file!");
        reject(err);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (photoURL) => {
          resolve(photoURL);
        });
      }
    );
  });
};

export const deleteFile = (photoURL) => {
  const storage = getStorage();

  var pictureItem = photoURL;
  var url_token = pictureItem.split("?");
  var url = url_token[0].split("/");
  var filePath = url[url.length - 1].replaceAll("%2F", "/");

  // Create a reference to the file to delete
  const storageRef = ref(storage, filePath);

  // Delete the file
  deleteObject(storageRef)
    .then(() => {})
    .catch((error) => {
      toast.error("Error deleting file!");
    });
};
