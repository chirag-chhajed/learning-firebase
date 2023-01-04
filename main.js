import { initializeApp } from 'firebase/app'
import { getAnalytics } from "firebase/analytics";
// import styles from 'style.css'
import {
  getFirestore,
  collection,
  // getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where, updateDoc,
  orderBy, serverTimestamp, getDoc
} from 'firebase/firestore'

import {
  getAuth,
  createUserWithEmailAndPassword, signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCaUQNbE6wtlbBDr0oe4_OwkMVohV9y_4w",
  authDomain: "fir-22e6d.firebaseapp.com",
  projectId: "fir-22e6d",
  storageBucket: "fir-22e6d.appspot.com",
  messagingSenderId: "361515786722",
  appId: "1:361515786722:web:e4c9ae76d9211c688059bb",
  measurementId: "G-GRCKSFSH2Q"
};

initializeApp(firebaseConfig)
// getAnalytics(initializeApp(firebaseConfig))

const db = getFirestore()
const auth = getAuth()

// collection ref
const colRef = collection(db, 'books')

// queries
const q = query(colRef, orderBy('createdAt'))

// real time collection data

const unSubCol = onSnapshot(q, snapshot => {
  let books = []
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id })
  })
  console.log(books)
})

const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault()
  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp()
  })
    .then(() => {
      addBookForm.reset()
    })
})

const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const docRef = doc(db, 'books', deleteBookForm.id.value)
  deleteDoc(docRef)
    .then(() => {
      deleteBookForm.reset()
    })
})

// get a single document
const docRef = doc(db, 'books', '5WSE1brRIVf5CRgHC0IN')

const unsunDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
})

// updating a document
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const docRef = doc(db, 'books', updateForm.id.value)
  updateDoc(docRef, {
    title: 'updated title'
  })
    .then(() => {
      updateForm.reset()
    })
})

// signing users up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = signupForm.email.value
  const password = signupForm.password.value

  createUserWithEmailAndPassword(auth, email, password)
    .then(cred => {
      // console.log('user created:', cred.user)
      signupForm.reset()
    })
    .catch(err => {
      console.log(err.message)
    })
})

// logging in and out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click',() => {
  signOut(auth)
    .then(() => {
      // console.log( `the user signed out`);
    })
    .catch(err => console.log(err.message))
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = loginForm.email.value
  const password = loginForm.password.value

  signInWithEmailAndPassword(auth, email, password)
    .then(cred => {
      console.log('user logged in:', cred.user)
      loginForm.reset()
    })
    .catch(err => {
      console.log(err.message)
    })
})

// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log(`user status changed: ${user}`)
})

// unsubscribing from changes (auth & db)
const unSubButton = document.querySelector('.unsub')
unSubButton.addEventListener('click',()=>{
  console.log('unsubscribing');
  unSubCol()
  unsunDoc()
  unsubAuth()
})