import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration

const firebaseConfig = {
  apiKey: 'AIzaSyCB2ZbbCp8jl_4nN1xm5CfhYOUlB9JPH4E',
  authDomain: 'myproject-dc446.firebaseapp.com',
  projectId: 'myproject-dc446',
  storageBucket: 'myproject-dc446.appspot.com',
  messagingSenderId: '1094476013294',
  appId: '1:1094476013294:web:0c1169c915c08860675dff',
  measurementId: 'G-25ZVVC93DM',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
