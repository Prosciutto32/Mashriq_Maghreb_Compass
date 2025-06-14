
import { json } from '@sveltejs/kit';
import { staffHandler } from '$lib/firebase/staffHandler';
import { addUserToChannel } from '$lib/subscription/subscriptiondb.js';
import { notifyUser } from '$lib/subscription/subscriptiondb.js';

export async function POST({ request }) {
	const { email } = await request.json();
	
	await staffHandler.makeUserStaff(email);
	addUserToChannel(email, "staff");
	notifyUser(email, "you have been promoted to Staff");

	return json({ success: true });
}
