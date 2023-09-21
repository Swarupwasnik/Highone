import { initializeApp } from "firebase/app"
// import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"
// import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAL7y_Uzk0ZHtPxr11UO0EzYSq0stMuTHk",
  authDomain: "sps-project-cee0e.firebaseapp.com",
  projectId: "sps-project-cee0e",
  storageBucket: "sps-project-cee0e.appspot.com",
  messagingSenderId: "882092014287",
  appId: "1:882092014287:web:ab601fd016fd7a903bd5ba",
  measurementId: "G-QMZMKEMNGT",
}

export const app = initializeApp(firebaseConfig)
// export const auth = getAuth();
// export const db = getFirestore()

export const storage = getStorage(app)
