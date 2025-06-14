<script lang="ts">
    import Auhtenticate from "$lib/components/Auhtenticate.svelte";
    import { auth, db } from "$lib/firebase/frebase.client";
    import { goto } from '$app/navigation';
	import { doc, getDoc, setDoc } from "firebase/firestore";
    import { onMount } from "svelte";

    const nonAuthRoutes = ["/", "product"];
    onMount(async () => {
        await fetch('/api/set-admin', {
            method: 'POST',
        });
        // This is where you can add any logic that should run when the layout is mounted
        const unsuscribe = auth.onAuthStateChanged (async (user) => {
            if (user) {
                user.getIdTokenResult(true) // true forces token refresh
                .then((idTokenResult) => {
                    // Access custom claims
                    if (idTokenResult.claims.admin) {
                        console.log('User is admin');
                        // If user is admin, redirect to admin dashboard
                        goto("/login/admin_dashboard"); 
                        return;
                    }
                    if (idTokenResult.claims.staff) {
                        console.log('User is staff');
                        // If user is staff, redirect to staff dashboard
                        goto("/login/staff_dashboard");
                        return;
                    }
                    // If user is authenticated and is on the login page, redirect to home
                    console.log("Is admin?", idTokenResult.claims.admin);
                    console.log('User is authenticated');
                    goto ("/login/home");
                    return;
                });
            }
        });
    });
</script>

<Auhtenticate/>