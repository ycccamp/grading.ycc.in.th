import firebase from 'firebase'
import '@firebase/firestore'
import SagaFirebase from 'redux-saga-firebase'

const config = {
  apiKey: 'AIzaSyBNxcnU0P4XyuwybfISGtYasiEZbzpgV1A',
  authDomain: 'jwcx-196915.firebaseapp.com',
  databaseURL: 'https://jwcx-196915.firebaseio.com',
  projectId: 'jwcx-196915',
  storageBucket: 'jwcx-196915.appspot.com',
  messagingSenderId: '774371380064',
}

export const app = firebase.initializeApp(config)

export default new SagaFirebase(app)
