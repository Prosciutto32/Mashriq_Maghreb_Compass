import { json } from '@sveltejs/kit';
import admin from '$lib/firebase/admin.js';

export async function DELETE({ params }) {
    const { about_id } = params;

    if (!about_id) {
        return json({ error: 'Missing about ID' }, { status: 400 });
    }

    try {
        await admin.firestore().collection('abouts').doc(about_id).delete();
        return json({ success: true });
    } catch (error) {
        console.error('Error deleting about:', error);
        return json({ error: 'Failed to delete about' }, { status: 500 });
    }
}

export async function PATCH({ params, request }) {
    const { about_id } = params;

    if (!about_id) {
        return json({ error: 'Missing about ID' }, { status: 400 });
    }

    try {
        const updatedData = await request.json();
        await admin.firestore().collection('abouts').doc(about_id).update(updatedData);
        return json({ success: true });
    } catch (error) {
        console.error('Error updating about:', error);
        return json({ error: 'Failed to update about' }, { status: 500 });
    }
}

