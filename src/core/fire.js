import firebase from 'firebase'

import '@firebase/firestore'

import SagaFirebase from 'redux-saga-firebase'
import dotenv from 'dotenv'

dotenv.config()

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'ycc2020.firebaseapp.com',
  databaseURL: 'https://ycc2020.firebaseio.com',
  projectId: 'ycc2020',
  storageBucket: 'ycc2020.appspot.com',
  messagingSenderId: '959291668430',
  appId: '1:959291668430:web:ab7ec20b9a3cb0a6879d9f',
  measurementId: 'G-6KCXHLX74P',
}

export const app = firebase.initializeApp(config)

export default new SagaFirebase(app)
