import admin from "$lib/firebase/admin";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {

    const newValue = await request.json();

    if (newValue == null || newValue.value_text == null) {
        return json({ error: 'Invalid value data:', newValue }, { status: 400 });
    }

    try {
        const valueRef = await admin.firestore().collection('values').add(newValue);
        return json({ success: true, value_id: valueRef.id });
    } catch (error) {
        console.error('Error creating value:', error);
        return json({ error: 'Failed to create value' }, { status: 500 });
    }
}



















// Compare this snippet from src/routes/api/visions/%2Bserver.ts:dddfdsfsdfsdf