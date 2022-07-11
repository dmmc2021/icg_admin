import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDQwLZDK2E1BXic806He2VOxoYz04Pkdjo",
  authDomain: "ilap-web.firebaseapp.com",
  projectId: "ilap-web",
  storageBucket: "ilap-web.appspot.com",
  messagingSenderId: "444470733449",
  appId: "1:444470733449:web:234fa7f384e77a802a3458"
};
  // Initialize Firebase
  const fire = firebase.initializeApp(firebaseConfig);
  const store = fire.firestore();
  const auth = fire.auth();
  
  export default store;

  export {auth};
  

