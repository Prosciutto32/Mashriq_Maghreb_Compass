
import { json } from '@sveltejs/kit';
import { staffHandler } from '$lib/firebase/staffHandler';
import { notifyUser, removeUserFromChannel } from '$lib/subscription/subscriptiondb.js';

export async function POST({ request }) {
	const { email } = await request.json();
	
	removeUserFromChannel(email, "staff");
	await staffHandler.demoteStaffUser(email);
	notifyUser(email, "you have been undemoted to User");
	

	return json({ success: true });
}
