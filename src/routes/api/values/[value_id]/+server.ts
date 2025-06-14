import { json } from '@sveltejs/kit';
import admin from '$lib/firebase/admin.js';

export async function DELETE({ params }) {
    const { value_id } = params;

    if (!value_id) {
        return json({ error: 'Missing value ID' }, { status: 400 });
    }

    try {
        await admin.firestore().collection('values').doc(value_id).delete();
        return json({ success: true });
    } catch (error) {
        console.error('Error deleting value:', error);
        return json({ error: 'Failed to delete value' }, { status: 500 });
    }
}

export async function PATCH({ params, request }) {
    const { value_id } = params;

    if (!value_id) {
        return json({ error: 'Missing value ID' }, { status: 400 });
    }

    try {
        const updatedData = await request.json();
        await admin.firestore().collection('values').doc(value_id).update(updatedData);
        return json({ success: true });
    } catch (error) {
        console.error('Error updating value:', error);
        return json({ error: 'Failed to update value' }, { status: 500 });
    }
}

