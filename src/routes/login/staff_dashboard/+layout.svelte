<script lang="ts">
	import { page } from "$app/state";
	import { authHandler } from "$lib/store/server.store";
	import UserCard from "$lib/components/UserCard.svelte";
	import { onMount } from "svelte";
	import { auth } from "$lib/firebase/frebase.client";
	let user: any = $state(null);
	let Saved_Name: string = $state("");
	let Saved_photoURL: string = $state("");
	let { children } = $props();

    onMount(() => {
        console.log("Mounting User");
        const unsubscribe = auth.onAuthStateChanged(async (u) => {
            user = u;
            if (!user) {
                window.location.href = "/login";
                return;
            }
            Saved_Name = user.displayName ?? user.email ?? "name";
            Saved_photoURL = user.photoURL ?? "/logo.svg";
            console.log("User:", Saved_Name, "Photo:", Saved_photoURL);
        });

    });
    
</script>

<div class="grid-container">
	<div class="user-column">
        <UserCard name={Saved_Name} photoURL={Saved_photoURL} link="/login/admin_dashboard" />
        
		<div class="actions">
			<a href="/login/staff_dashboard/handle_requests"  aria-current={page.url.pathname === '/login/staff_dashboard/handle_requests'}> Handle Requests</a>
			<a href="/login/staff_dashboard/add_post" aria-current={page.url.pathname === '/login/staff_dashboard/add_post'}>Add Post</a>
			<a href="/login/staff_dashboard/edit_post" aria-current={page.url.pathname === '/login/staff_dashboard/edit_post'}>Edit Post</a>
		</div>
		<button class="cancel" onclick={() => authHandler.logout()}>logout</button>
	</div>

	<div class="content-column">
		{@render children()}
	</div>
</div>

<style>
	.grid-container {
		display: grid;
		grid-template-columns: 1.4fr 5fr;
	}

	.user-column {
		background-color: var(--color-bg);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		border-radius: 10px 0 0 10px;
		padding: 2rem 1.5rem;
		margin-left: 1.5rem;
		border-right: 1px solid var(--color-accent);
		color: var(--color-text);
		box-shadow: 0 2px 8px rgba(0,0,0,0.04);
	}

	.content-column {
		padding: 1rem;
		background-color: var(--color-muted);
		border-bottom-right-radius: 10px;
		border-top-right-radius: 10px;
		margin-right: 2rem;
	}

	.actions {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 1rem;
		margin-bottom: 1rem;
	}

	.actions a {
		text-decoration: none;
		color: var(--color-text);
		font-weight: 500;
		letter-spacing: 0.03em;
		padding: 0.5em 1em;
		border-radius: 6px;
		transition: background 0.2s, color 0.2s;
		display: inline-block;
	}

	.actions a[aria-current='true'] {
		background: var(--color-accent);
		color: var(--color-bg);
		box-shadow: 0 2px 8px rgba(132, 140, 137, 0.08);
	}

	.actions a:hover {
		background: var(--color-muted);
		color: var(--color-bg);
	}

	.actions a:active {
		background: var(--color-accent);
		color: var(--color-bg);
	}

	.user-column button {
		padding: 10px;
		border-radius: 5px;
		border: none;
		cursor: pointer;
		font-size: 1rem;
	}

	.user-column button:hover {
		background-color: var(--color-accent);
	}

	button.cancel{
		border: 2px solid var(--color-error);
		background-color: transparent;
		color: var(--color-error);
	}
	button.cancel:hover{
		border: 2px solid var(--color-error);
		background-color: var(--color-background-cancel-button-hover);
		color: var(--color-error);
	}
</style>
