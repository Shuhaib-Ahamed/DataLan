// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-JSovgbjBeCgTv_TKtfW0o-FIygYEfpU",
  authDomain: "auto-cs-14a6f.firebaseapp.com",
  projectId: "auto-cs-14a6f",
  storageBucket: "auto-cs-14a6f.appspot.com",
  messagingSenderId: "883312086325",
  appId: "1:883312086325:web:3968c7029bf2e878a2907c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase storage reference
const storage = getStorage(app);
export default storage;
