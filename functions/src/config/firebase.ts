import * as admin from "firebase-admin";


admin.initializeApp();

const db = admin.firestore();
const auth  = admin.auth()
const storageBucket = admin.storage().bucket()


storageBucket.makePublic()



export {admin, db, storageBucket,auth};

