import { notifyChannel } from "$lib/subscription/subscriptiondb";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
    const { channel, body } = await request.json();
    console.log("Received email:", channel);
    console.log("Received payload:", body);
    const payload = JSON.stringify({
		title: "Mashriq Maghreb Compass",
		body: body,
		icon: "/logo.svg", 
	});
        console.log(payload+ "with body "+ body);

    await notifyChannel(channel, payload);

    return json({ success: true });
}

