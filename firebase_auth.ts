// firebase_auth.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyDZYwPVjzlk2OgwjcXjlKZW8bez0RODoAk',
    authDomain: 'unremovable-watermark.firebaseapp.com',
    projectId: 'unremovable-watermark',
    storageBucket: 'unremovable-watermark.appspot.com',
    messagingSenderId: '1043478047685',
    appId: '1:1043478047685:web:8894bb06108340c27939ac',
    measurementId: 'G-F5QMN3M6R8',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error('Google login failed:', error);
        return null;
    }
};

const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Logout failed:', error);
    }
};

export { auth, loginWithGoogle, logout, onAuthStateChanged };
