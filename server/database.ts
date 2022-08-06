import * as firebase from "firebase-admin";
import * as serviceAccount from "./keyAccount.json";

const initializeDatabase = firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount as any),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const dataBase = firebase.firestore();
const realtimeDB = firebase.database(initializeDatabase);

export { dataBase, realtimeDB };
