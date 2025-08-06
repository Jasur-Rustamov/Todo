importScripts('https://www.gstatic.com/firebasejs/10.3.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.3.1/firebase-messaging-compat.js')

firebase.initializeApp({
    apiKey: "AIzaSyDJFs1ZBbxivhVv1_T8ZW89OroaWWmV8C0",
    authDomain: "first-project-79f9b.firebaseapp.com",
    projectId: "first-project-79f9b",
    storageBucket: "first-project-79f9b.appspot.com",
    messagingSenderId: "146343472746",
    appId: "1:146343472746:web:f15a0afedbd2348bc76413",
    measurementId: "G-SD9YM697KB"
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage(payload => {
    console.log('[firebase-messaging-sw.js] Получено фоновое сообщение:', payload)
})
