import * as firebase from "firebase-admin";
const serviceAccount = JSON.parse(process.env.FIREBASE_CONNECTION)
const initializeDatabase = firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount as any),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const dataBase = firebase.firestore();
const realtimeDB = firebase.database(initializeDatabase);

export { dataBase, realtimeDB };
