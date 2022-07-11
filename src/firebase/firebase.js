import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBh-_NSaCsT2DysHxS8iPbHnhMGXylAYmM",
  authDomain: "web-icg.firebaseapp.com",
  projectId: "web-icg",
  storageBucket: "web-icg.appspot.com",
  messagingSenderId: "968818496641",
  appId: "1:968818496641:web:b2cfc616c1cc14ed98a980"
};
  // Initialize Firebase
  const fire = firebase.initializeApp(firebaseConfig);
  const store = fire.firestore();
  const auth = fire.auth();
  
  export default store;

  export {auth};
  

