<script lang='ts'>
	import { goto } from "$app/navigation";
	import Footer from "$lib/components/Footer.svelte";
    import Header from "$lib/components/Header.svelte";
	import { auth } from "$lib/firebase/frebase.client";
	import { onMount } from "svelte";

    let { children } = $props();
    const unsuscribe = auth.onAuthStateChanged (async (user) => {
            if (user) {
                user.getIdTokenResult(true) 
                .then((idTokenResult) => {
                    // Access custom claims
                    if (idTokenResult.claims.admin) {
                        // get current user location
                        const currentPath = window.location.pathname;
                        if (currentPath.startsWith("/login/home")) goto("/login/admin_dashboard"); 
                        if (currentPath.startsWith("/login/staff_dashboard")) goto("/login/admin_dashboard"); 
                        return;
                    }
                    if (idTokenResult.claims.staff) {

                        const currentPath = window.location.pathname;
                        if (currentPath.startsWith("/login/home")) goto("/login/staff_dashboard");; 
                        if (currentPath.startsWith("/login/admin_dashboard")) goto("/login/staff_dashboard"); 
                        return;
                    }
                    // If user is authenticated and is on the login page, redirect to home
                    const currentPath = window.location.pathname;
                    if (currentPath.startsWith("/login/staff_dashboard")) goto("/login/home");; 
                    if (currentPath.startsWith("/login/admin_dashboard")) goto("/login/home"); 
                    return;
                });
            }
        });



    function detectSWUpdate() {
        navigator.serviceWorker.ready.then((registration) => {
            registration.addEventListener('updatefound', () => {
                const newSW = registration.installing;

                newSW?.addEventListener('statechange', () => {
                    if (newSW.state === 'installed') {
                        if (confirm('A new update is available! Reload to update?')) {
                            newSW.postMessage({ type: 'SKIP_WAITING' });
                            window.location.reload();
                        }
                    }
                });
            });
        });
    }

    onMount(() => {
        detectSWUpdate();
    });

</script>

    <div class="body">
    <Header/>
    {@render children()}
    <Footer/>
    </div>
<style>
    .body {
        min-height: 100vh;
        max-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
</style>