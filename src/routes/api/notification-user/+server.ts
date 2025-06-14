import { notifyUser } from "$lib/subscription/subscriptiondb";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
	const { email, body } = await request.json();
	console.log("Received email:", email);

	const payload = JSON.stringify({
		title: "Mashriq Maghreb Compass",
		body: body,
		icon: "/logo.svg", 
	});
	await notifyUser(email, payload);

	return json({ success: true });
}
