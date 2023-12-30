// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyChpnFB9bfH9yFz8viEYmEOea77HYWfmGg',
    authDomain: 'forestfire-24495.firebaseapp.com',
    projectId: 'forestfire-24495',
    storageBucket: 'forestfire-24495.appspot.com',
    messagingSenderId: '862386821143',
    appId: '1:862386821143:web:9967c0c02cd1732b246452',
    measurementId: 'G-6RHN0MNJ1C',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);
