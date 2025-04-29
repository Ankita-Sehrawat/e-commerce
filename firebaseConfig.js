import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
    apiKey: "AIzaSyCT8YPETPOlXJgbDGs9MgWuitKY1XIW6Qc",
    authDomain: "user-authentication-4cd72.firebaseapp.com",
    projectId: "user-authentication-4cd72",
    storageBucket: "user-authentication-4cd72.firebasestorage.app",
    messagingSenderId: "43450909822",
    appId: "1:43450909822:web:1989c6540b815139c0c42f",
    measurementId: "G-3DM1LBWMGF"
};


export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);