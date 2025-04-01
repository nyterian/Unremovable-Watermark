// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDZYwPVjzlk2OgwjcXjlKZW8bez0RODoAk",
    authDomain: "unremovable-watermark.firebaseapp.com",
    projectId: "unremovable-watermark",
    storageBucket: "unremovable-watermark.appspot.com",
    messagingSenderId: "1043478047685",
    appId: "1:1043478047685:web:8894bb06108340c27939ac",
    measurementId: "G-F5QMN3M6R8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
