// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhQEmEzODngaOSeN9UCotgnJlI_ip-tmY",
  authDomain: "onlineeducation-cffb9.firebaseapp.com",
  projectId: "onlineeducation-cffb9",
  storageBucket: "onlineeducation-cffb9.appspot.com",
  messagingSenderId: "982988547906",
  appId: "1:982988547906:web:18d0069650e6bae329cadb",
  measurementId: "G-2RVQLXXE4Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;