import * as admin from "firebase-admin";


admin.initializeApp();
const db = admin.firestore();
const storageBucket = admin.storage().bucket()
storageBucket.makePublic()

export {admin, db, storageBucket};

