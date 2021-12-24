import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp();
console.log(functions.config())
const db = admin.firestore();

export {admin, db};
