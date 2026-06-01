// shared/config.js — Firebase 초기화 단일 소스
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore  } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const FIREBASE_CONFIG = {
  apiKey:            'AIzaSyA7KylsSyT3_0oQvhBtcrPc-gcdfVq90IQ',
  authDomain:        'gzplan.firebaseapp.com',
  projectId:         'gzplan',
  storageBucket:     'gzplan.firebasestorage.app',
  messagingSenderId: '186255862586',
  appId:             '1:186255862586:web:f36d21f76012ca43b8fe03',
};

export const app = initializeApp(FIREBASE_CONFIG);
export const db  = getFirestore(app);
