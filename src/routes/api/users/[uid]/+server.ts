import { json } from '@sveltejs/kit';
import admin from '$lib/firebase/admin';
import { _listAllUsers } from "$lib/firebase/users";

export async function DELETE({ request }) {
	const { uid } = await request.json();

	if (!uid) {
		return json({ success: false, error: 'Missing UID' }, { status: 400 });
	}

	try {
		await admin.auth().deleteUser(uid);
		return json({ success: true });
	} catch (err) {
		console.error('❌ Error deleting user:', err);
		return json({ success: false, error: 'Error deleting user' }, { status: 500 });
	}
}


export async function POST({ request }) {
	try {
		const { uid } = await request.json();

		if (!uid) {
			return json({ success: false, error: 'Missing UID' }, { status: 400 });
		}

		const users = await _listAllUsers(); // Assume this returns all users
		const user = users.find((user) => user.uid === uid);

		if (!user) {
			return json({ success: false, error: 'User not found' }, { status: 404 });
		}

		return json({
			success: true,
			user: {
				uid: user.uid,
				email: user.email,
				displayName: user.displayName,
				photoURL: user.photoURL,
				role: user.role || "user"
			}
		});
	} catch (err) {
		console.error('❌ Error fetching user:', err);
		return json({ success: false, error: 'Error fetching user' }, { status: 500 });
	}
}