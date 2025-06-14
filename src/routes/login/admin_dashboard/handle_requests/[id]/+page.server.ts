import { notifyUser } from '$lib/subscription/subscriptiondb';
import { error, type Actions } from '@sveltejs/kit';
import { db } from '$lib/firebase/frebase.client';
import { doc, getDoc } from 'firebase/firestore';
import { _listAllUsers } from '$lib/firebase/users.js';

export function load({ params }) {
    return {
        id: params.id,
    };
}


