<script lang="ts">
  import { onMount } from "svelte";
  import { auth, db } from "$lib/firebase/frebase.client";
  import { collection, query, getDocs } from "firebase/firestore";
  import { onAuthStateChanged } from "firebase/auth";
  import { goto } from "$app/navigation";
  import type { Post } from '$lib';

  let userId: string | null = null;
  let posts: Post[] = $state([]);
  let loading = $state(true);
  let error = $state("");

  onMount(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        userId = user.uid;
        await fetchRequests();
      } else {
        error = "Utente non autenticato";
        loading = false;
        goto("/login");
      }
    });

    return () => unsubscribe();
  });

  async function fetchRequests() {
    try {
      loading = true;
      error = "";
      posts = [];

      const q = query(collection(db, "home"));
      const querySnapshot = await getDocs(q);

      posts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title || '',
        description: doc.data().description || '',
        photo: doc.data().photo || '',
        createdAt: doc.data().createdAt || ''
      }));

    } catch (e) {
      error = "Errore nel recupero delle richieste";
      console.error(e);
    } finally {
      loading = false;
    }
    posts = posts.filter(post => post.createdAt); // Filter out posts without createdAt
    // Ensure requests are sorted by createdAt in descending order
    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }


	function handleRequestClick(id: string) {
    goto(`/login/admin_dashboard/edit_posts/${id}`);
  }

</script>

<div class="posts-list">
  {#if loading}
    <p class="loading">Loading posts...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else if posts.length === 0}
    <p class="loading">No posts found.</p>
  {:else}
    {#each posts as post, i }
      <div
        tabindex={i + 1}
        role="button"
        class="post-item"
        onclick={() => handleRequestClick(post.id)}
        onkeydown={(e) => {

        }}
      >
        <div>
          <div class="title">{post.title}</div>
          <div class="created-at">{new Date(post.createdAt).toLocaleDateString()}</div>
        </div>
        <div class="content">
          <img src={post.photo} alt={post.title} >
          <div class="description">
            {post.description}
          </div>
        </div>
        
      </div>
    {/each}
  {/if}
</div>

<style>

  .posts-list {
    background-color: var(--color-bg);
    color: var(--color-text);
    padding: 1.5rem;
    border-radius: var(--border-radius);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .loading,
  .error {
    text-align: center;
    font-size: 1.1rem;
  }

  .error {
    color: var(--color-error);
  }

  .post-item {
    background-color: var(--color-text-secondary);
    border-radius: 1rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    outline: none;
    border: 2px solid transparent;
    transition: border-color 0.2s, transform 0.2s;
  }

  .post-item:focus,
  .post-item:hover {
    border-color: var(--color-highlight);
    transform: scale(1.01);
  }

  .title {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--color-highlight);
  }

  .created-at {
    font-size: 0.9rem;
    color: var(--color-muted);
    margin-bottom: 0.5rem;
  }

  .content {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .description {
    color: var(--color-text);
    font-size: 1rem;
  }

  img{
    width: 100px;
    height: auto;
    border-radius: 0.5rem;
  }
</style>

