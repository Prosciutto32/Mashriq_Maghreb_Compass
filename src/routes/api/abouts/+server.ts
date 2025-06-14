import admin from "$lib/firebase/admin";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
    
    const newAbout = await request.json();

    if (newAbout == null || newAbout.about_text == null) {
        return json({ error: 'Invalid about data:', newAbout }, { status: 400 });
    }

    try {
        const aboutRef = await admin.firestore().collection('abouts').add(newAbout);
        return json({ success: true, about_id: aboutRef.id });
    } catch (error) {
        console.error('Error creating about:', error);
        return json({ error: 'Failed to create about' }, { status: 500 });
    }
}