import { getDatabase } from 'firebase-admin/database';
const admin_db = getDatabase();
export default admin_db;
// This module initializes and exports the Firebase Realtime Database instance for use in server-side operations.