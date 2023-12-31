
 import firebase from 'firebase/compat/app';
 import 'firebase/compat/auth';
 import 'firebase/compat/firestore';
 import { getStorage } from "firebase/storage";
 
 const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyB-s7OlqzaaeMtFYS7LgCXWwSF-B3E9Rq4",
    authDomain: "instagram-project-react.firebaseapp.com",
    projectId: "instagram-project-react",
    storageBucket: "instagram-project-react.appspot.com",
    messagingSenderId: "81435370469",
    appId: "1:81435370469:web:a52c65aced1cc92bdc850c"
 });

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = getStorage(firebaseApp);

export{db,auth,storage};
