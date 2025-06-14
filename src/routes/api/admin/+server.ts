
import { json } from '@sveltejs/kit';
import { getAdmin } from '$lib/firebase/admin.js';

export async function GET() {

	let admin = await getAdmin();

	return json({ success: true, admin: admin });
}
