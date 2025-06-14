import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';
import serviceAccountRaw from '$lib/firebase/serviceAccount.json';
import { ADMIN_EMAIL } from '$env/static/private';

const serviceAccount = serviceAccountRaw as ServiceAccount;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
export default admin;

export function getAdmin(){
  return ADMIN_EMAIL;
}