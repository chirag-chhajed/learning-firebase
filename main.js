import {initializeApp} from 'firebase/app'
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
  where,
  orderBy, serverTimestamp,getDoc
} from 'firebase/firestore'

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

const db = getFirestore()

// collection ref
const colRef = collection(db, 'books')

// queries
const q = query(colRef,orderBy('createdAt'))

// real time collection data

onSnapshot(q, snapshot => {
  let books = []
  snapshot.docs.forEach((doc)=>{
    books.push({...doc.data(), id: doc.id})
  })
  console.log(books)
})

const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit',(e)=>{
  e.preventDefault()
  addDoc(colRef,{
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp()
  })
  .then(()=>{
    addBookForm.reset()
  })
})

const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit',(e)=>{
  e.preventDefault()
  const docRef = doc(db,'books', deleteBookForm.id.value)
  deleteDoc(docRef)
    .then(()=>{
      deleteBookForm.reset()
    })
})

// get a single document
const docRef = doc(db,'books','5WSE1brRIVf5CRgHC0IN')

getDoc(docRef)
  .then(doc => {
    console.log(doc.data(),doc.id);
  })

onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
})