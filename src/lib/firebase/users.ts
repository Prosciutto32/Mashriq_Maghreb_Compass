// Define the ListedUser type
import admin from '$lib/firebase/admin';
interface ListedUser {
    email: string;
    provider: string;
    creationDate: string;
    lastSignIn: string;
    uid: string;
    displayName?: string;
    photoURL?: string;
    role?: string; // Optional field for user role
}

interface ListUsersResult {
    users: admin.auth.UserRecord[];
    pageToken?: string;
}

export async function _listAllUsers(nextPageToken?: string): Promise<ListedUser[]> {
    const users: ListedUser[] = [];

    try {
        const result: ListUsersResult = await admin.auth().listUsers(1000, nextPageToken);
        result.users.forEach((userRecord: admin.auth.UserRecord) => {
            let role = 'user'; // Default role
            if (userRecord.customClaims) {
                if (userRecord.customClaims.admin) {
                    role = 'admin';
                } else if (userRecord.customClaims.staff) {
                    role = 'staff';
                }
            }
            const user: ListedUser = {
                email: userRecord.email || '(no email)',
                provider: userRecord.providerData.map((p: admin.auth.UserInfo) => p.providerId).join(', '),
                creationDate: new Date(userRecord.metadata.creationTime).toLocaleDateString('it-IT'),
                lastSignIn: new Date(userRecord.metadata.lastSignInTime).toLocaleDateString('it-IT'),
                uid: userRecord.uid,
                displayName: userRecord.displayName || undefined,
                photoURL: userRecord.photoURL || undefined,
                role: role // Include the role in the user object
            };
            users.push(user);
        });

        if (result.pageToken) {
            const nextUsers: ListedUser[] = await _listAllUsers(result.pageToken);
            return users.concat(nextUsers);
        } else {
            return users;
        }
    } catch (error: unknown) {
        console.error('Error listing users:', error);
        return [];
    }
}

// Print the result as a table
_listAllUsers().then(users => {
  console.table(users, ['email', 'provider', 'creationDate', 'lastSignIn', 'uid']);
});

// To get the users array, use 'await' inside an async function or handle the promise properly

