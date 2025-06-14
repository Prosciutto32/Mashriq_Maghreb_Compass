import admin from "$lib/firebase/admin";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
    const newContact = await request.json();

    if (newContact == null || newContact.contact_type == "email" && !newContact.contact_email || newContact.contact_type == "phone" && !newContact.contact_phone) {
        return json({ error: 'Invalid contact data:', newContact }, { status: 400 });
    }

    try {
        const contactRef = await admin.firestore().collection('contacts').add(newContact);
        return json({ success: true, contact_id: contactRef.id });
    } catch (error) {
        console.error('Error creating contact:', error);
        return json({ error: 'Failed to create contact' }, { status: 500 });
    }
}