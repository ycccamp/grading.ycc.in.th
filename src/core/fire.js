import firebase from 'firebase'
import '@firebase/firestore'
import SagaFirebase from 'redux-saga-firebase'

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'ycc2020.firebaseapp.com',
  databaseURL: 'https://ycc2020.firebaseio.com',
  projectId: 'ycc2020',
  storageBucket: 'ycc2020.appspot.com',
  messagingSenderId: '959291668430',
  appId: '1:959291668430:web:213f0abec4a89e5f879d9f',
  measurementId: 'G-C5LLV6B34N',
}

export const app = firebase.initializeApp(config)

window.$app = app

export default new SagaFirebase(app)
