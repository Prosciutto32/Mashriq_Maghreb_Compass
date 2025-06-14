import { json } from '@sveltejs/kit';
import admin from '$lib/firebase/admin.js';

export async function DELETE({ params }) {
	const { post_id } = params;

	if (!post_id) {
		return json({ error: 'Missing post ID' }, { status: 400 });
	}

	try {
		await admin.firestore().collection('home').doc(post_id).delete();
		return json({ success: true });
	} catch (error) {
		console.error('Error deleting post:', error);
		return json({ error: 'Failed to delete post' }, { status: 500 });
	}
}

export async function PATCH({ params, request }) {
    const { post_id } = params;

    if (!post_id) {
        return json({ error: 'Missing post ID' }, { status: 400 });
    }

    try {
        const updatedData = await request.json();
        await admin.firestore().collection('home').doc(post_id).update(updatedData);
        return json({ success: true });
    } catch (error) {
        console.error('Error updating post:', error);
        return json({ error: 'Failed to update post' }, { status: 500 });
    }
}