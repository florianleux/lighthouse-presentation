import { initializeApp, type FirebaseApp } from 'firebase/app'
import { initializeFirestore, type Firestore } from 'firebase/firestore'

let app: FirebaseApp | null = null
let db: Firestore | null = null

export function initFirebase(): Firestore | null {
  if (db) return db

  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
  }

  if (!config.apiKey || !config.projectId) {
    console.warn('[Firebase] Missing config — running in offline mode')
    return null
  }

  app = initializeApp(config)
  // experimentalAutoDetectLongPolling: tente WebChannel puis bascule en
  // long-polling si bloqué (Brave Shields, bloqueurs de pubs, proxies mobiles
  // cassent le streaming WebChannel par défaut vers firestore.googleapis.com).
  db = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  })
  console.log('[Firebase] Initialized for project:', config.projectId)
  return db
}

export function getDb(): Firestore | null {
  return db
}
