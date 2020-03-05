import firebase from 'firebase'
import '@firebase/firestore'
import SagaFirebase from 'redux-saga-firebase'

const config = {
  apiKey: 'AIzaSyBoT3SIWbgGNf7QEqMIL8p3mHUWe7y-HuI',
  authDomain: 'ycc2020.firebaseapp.com',
  databaseURL: 'https://ycc2020.firebaseio.com',
  projectId: 'ycc2020',
  storageBucket: 'ycc2020.appspot.com',
  messagingSenderId: '959291668430',
  appId: '1:959291668430:web:ab7ec20b9a3cb0a6879d9f',
  measurementId: 'G-6KCXHLX74P',
}

/*
const Oldconfig = {
  apiKey: 'AIzaSyD69fVmX1N539fYPjj4X2mu7hDR4LYAnL8',
  authDomain: 'ycccamp.firebaseapp.com',
  databaseURL: 'https://ycccamp.firebaseio.com',
  projectId: 'ycccamp',
  storageBucket: 'ycccamp.appspot.com',
  messagingSenderId: '191460697180',
}
*/

export const app = firebase.initializeApp(config)

export default new SagaFirebase(app)
