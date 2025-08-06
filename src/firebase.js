import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getMessaging } from 'firebase/messaging' 

const firebaseConfig = {
    apiKey: "AIzaSyDJFs1ZBbxivhVv1_T8ZW89OroaWWmV8C0",
    authDomain: "first-project-79f9b.firebaseapp.com",
    projectId: "first-project-79f9b",
    storageBucket: "first-project-79f9b.appspot.com",
    messagingSenderId: "146343472746",
    appId: "1:146343472746:web:f15a0afedbd2348bc76413",
    measurementId: "G-SD9YM697KB"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const messaging = getMessaging(app) 

export { app, auth, db, messaging } 
