import { getAuth } from 'firebase-admin/auth';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { addUserDevice, addUserToChannel } from '$lib/subscription/subscriptiondb';
import admin from '$lib/firebase/admin';
let app =admin.app();

export const POST = (async ({ request }) => {
	const authHeader = request.headers.get('authorization');
	const token = authHeader?.split(' ')[1];

	if (!token) throw error(401, 'Missing token');

	let email: string|undefined;

	try {
		const decodedToken = await getAuth(app).verifyIdToken(token);
		email = decodedToken.email;
		if (!email) throw error(401, 'Email not found in token');
	} catch (err) {
		console.error('Token verification failed:', err);
		throw error(401, 'Invalid token');
	}

	const data = await request.json();
	if (!data.subscription) {
		throw error(400, 'Bad Request: Missing subscription');
	}

	await addUserDevice(email, data.subscription);
	await addUserToChannel(email, 'album-updates');

	return json({ success: true });
}) satisfies RequestHandler;
