import { json } from '@sveltejs/kit';
import admin from '$lib/firebase/admin.js';

export async function DELETE({ params }) {
    const { contact_id } = params;

    if (!contact_id) {
        return json({ error: 'Missing contact ID' }, { status: 400 });
    }

    try {
        await admin.firestore().collection('contacts').doc(contact_id).delete();
        return json({ success: true });
    } catch (error) {
        console.error('Error deleting contact:', error);
        return json({ error: 'Failed to delete contact' }, { status: 500 });
    }
}

export async function PATCH({ params, request }) {
    const { contact_id } = params;

    if (!contact_id) {
        return json({ error: 'Missing contact ID' }, { status: 400 });
    }

    try {
        const updatedData = await request.json();
        await admin.firestore().collection('contacts').doc(contact_id).update(updatedData);
        return json({ success: true });
    } catch (error) {
        console.error('Error updating contact:', error);
        return json({ error: 'Failed to update contact' }, { status: 500 });
    }
}

