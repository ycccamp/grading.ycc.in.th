import firebase from 'firebase'
import '@firebase/firestore'
import SagaFirebase from 'redux-saga-firebase'

const config = {
  apiKey: 'AIzaSyD69fVmX1N539fYPjj4X2mu7hDR4LYAnL8',
  authDomain: 'ycccamp.firebaseapp.com',
  databaseURL: 'https://ycccamp.firebaseio.com',
  projectId: 'ycccamp',
  storageBucket: 'ycccamp.appspot.com',
  messagingSenderId: '191460697180',
}

export const app = firebase.initializeApp(config)

export default new SagaFirebase(app)
