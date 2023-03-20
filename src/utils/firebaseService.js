import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { toast } from "react-toastify";
import storage from "../firebaseConfig";

const user = localStorage.user && JSON.parse(localStorage.getItem("user"));

export const uploadFile = async (file) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `/profiles/${user._id}/${file?.name}`);
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
  console.log(filePath);

  // Create a reference to the file to delete
  const storageRef = ref(storage, filePath);

  // Delete the file
  deleteObject(storageRef)
    .then(() => {})
    .catch((error) => {
      // Uh-oh, an error occurred!
    });
};
