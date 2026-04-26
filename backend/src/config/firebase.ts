import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

if (!admin.apps.length) {
  try {
    const serviceAccountJSON = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (serviceAccountJSON) {
      const serviceAccount = JSON.parse(serviceAccountJSON);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("Firebase Admin initialized successfully.");
    } else {
      console.warn("FIREBASE_SERVICE_ACCOUNT_JSON is missing. Firebase features may not work.");
    }
  } catch (error) {
    console.warn("Firebase Admin failed to initialize. Check FIREBASE_SERVICE_ACCOUNT_JSON.", error);
  }
}

export const db: admin.firestore.Firestore | null = admin.apps.length ? admin.firestore() : null;
export const auth: admin.auth.Auth | null = admin.apps.length ? admin.auth() : null;
export { admin };
