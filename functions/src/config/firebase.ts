import { config } from 'dotenv';
import {
  initializeApp as initializeAdminApp,
  getApps as getAdminApps,
} from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';

// Load the correct .env file based on the NODE_ENV
const envPath = `.env.${process.env.NODE_ENV}`;
config({ path: envPath });

// Firebase Admin SDK initialization
let adminApp;
if (!getAdminApps().length) {
  adminApp = initializeAdminApp();
} else {
  adminApp = getAdminApps()[0];
}

const db = getFirestore(adminApp);
const adminAuth = getAdminAuth(adminApp);

export { adminApp, db, adminAuth };
