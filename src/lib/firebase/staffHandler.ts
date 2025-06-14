import admin  from '$lib/firebase/admin';

export const staffHandler = {
	makeUserStaff: async (email: string): Promise<void> => {
		try {
			const user = await admin.auth().getUserByEmail(email);
			await admin.auth().setCustomUserClaims(user.uid, { staff: true });
		} catch (error) {
			console.error(` Errore nell'impostare lo staff per ${email}:`, error);
		}
	},

	demoteStaffUser: async (email: string): Promise<void> => {
		try {
			const user = await admin.auth().getUserByEmail(email);
			await admin.auth().setCustomUserClaims(user.uid, { staff: false });
		} catch (error) {
			console.error(` Errore nel rimuovere lo staff per ${email}:`, error);
		}
	}
};
