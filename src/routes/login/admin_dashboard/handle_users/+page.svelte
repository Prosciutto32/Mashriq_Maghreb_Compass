<script lang="ts">
  import UserTab from "$lib/components/UserTab.svelte";
  import { writable, derived } from 'svelte/store';


  export let data: {
    users: Array<{
      uid: string;
      displayName: string | null;
      role: string;
      email: string;
    }>;
  };

  const search = writable('');

  const filteredUsers = derived([search], ([$search]) => {
    const lower = $search.toLowerCase();

    return data.users
        .filter((user) => user.role !== "staff" && user.role !== "admin")
        .filter((user) => {
        if (!$search.trim()) return true;
        return (
            (user.displayName && user.displayName.toLowerCase().includes(lower)) ||
            user.email.toLowerCase().includes(lower)
        );
        });
    });

</script>

<section class="container">
  <h1>List of Users</h1>

  <input
    type="text"
    placeholder="🔍 Search by username or email..."
    oninput={(e) => search.set((e.target as HTMLInputElement).value)}
    class="search-input"
  />

  {#if $filteredUsers.length > 0}
    {#each $filteredUsers as user}
      <UserTab
        displayName={user.displayName}
        email={user.email}
        role={user.role}
        uid={user.uid}
      />
    {/each}
  {:else}
    <p class="no-results">No users found.</p>
  {/if}
</section>

<style>
  .container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1rem;
  }

  h1 {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: #333;
  }

  .search-input {
    display: block;
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border-radius: 0.5rem;
    border: 1.5px solid var(--color-accent);
    margin-bottom: 2rem;
    background-color: var(--color-bg);
    color: var(--color-text);
    font-family: 'Inter', sans-serif;
    box-sizing: border-box;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .search-input:focus {
    border-color: var(--color-highlight);
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 119, 204, 0.2);
  }

  .no-results {
    text-align: center;
    font-style: italic;
    color: var(--color-error);
    font-weight: bold;
    font-size: 1.2rem;
  }
</style>
