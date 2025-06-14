<script lang="ts">
    import { getAuth } from "firebase/auth";
    import { onMount } from "svelte";
    import Profile from "$lib/components/Profile.svelte";
	import { goto } from "$app/navigation";

    let user: any = $state(null);

    onMount(() => {
        console.log("Mounting User");
        const auth = getAuth();
         const unsuscribe = auth.onAuthStateChanged (async (user) => {
            const currPath = window.location.pathname;
            if (user && currPath === "/login/staff_dashboard") {
                user.getIdTokenResult(true) // true forces token refresh
                .then((idTokenResult) => {
                    // Access custom claims
                    if (idTokenResult.claims.admin) {
                        console.log('User is admin');
                        // If user is admin, redirect to admin dashboard
                        goto("/login/staff_dashboard");
                        return;
                    }
                    if (idTokenResult.claims.staff) {
                        console.log('User is staff');
                        // If user is staff, redirect to staff dashboard
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

<Profile />