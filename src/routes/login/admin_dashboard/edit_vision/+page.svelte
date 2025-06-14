<script lang="ts">
  import { auth, db } from '$lib/firebase/frebase.client';
  import { onMount } from 'svelte';
  import { onAuthStateChanged } from 'firebase/auth';
  import ShowPost from '$lib/components/ShowPost.svelte';
  import type { Post } from '$lib';
  import EditPost from '$lib/components/EditPost.svelte';
  import { doc, getDoc } from 'firebase/firestore';

  let userId: string | null = null;
  let post_id = "vision";
  let loading = $state(false);
  let error = $state('');
  let vision: Post = $state({
    id: '',
    title: '',
    description: '',
    createdAt: '',
    photo: '',
  });

  onMount(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        userId = user.uid;
        await fetchVision();
      } else {
        error = "Utente non autenticato";
        loading = false;
      }
    });
    return () => unsubscribe();
  });

  async function fetchVision() {
    try {
      loading = true;
      error = "";
      const docRef = doc(db, 'home', post_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        vision = {
          id: post_id,
          title: data.title || '',
          description: data.description || '',
          photo: data.photo || '',
          createdAt: data.createdAt || ''
        };
      } else {
        error = "Nessuna richiesta trovata";
      }
    } catch (e) {
      error = "Errore nel recupero delle richieste";
      console.error(e);
    } finally {
      loading = false;
    }
  } 
</script>
<div class="body">
  {#if loading}
      <p class="loading">Loading Vision...</p>
  {:else if error}
      <p class="error">{error}</p>
  {/if}
  <div class="post">
    <ShowPost post={vision} />
  </div>

  <!-- option to change title image and description -->
  <!-- Add your form or other components here to edit the post -->
  <EditPost post_id={post_id} post={vision} fetchFunction={fetchVision}/>
</div>

<style>

  .body {
    font-family: 'Inter', sans-serif;
    color: var(--color-bg);
    margin: 0;
    padding: 2rem 1rem;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
  }

  /* Loading and error text */
  .loading,
  .error {
    width: 100%;
    max-width: 700px;
    margin: 1rem auto;
    padding: 1rem;
    font-weight: 600;
    font-size: 1.1rem;
    border-radius: 8px;
    text-align: center;
    user-select: none;
  }

  .loading {
    background-color: var(--color-accent);
    color: var(--color-bg);
  }

  .error {
    background-color: var(--color-error);
    color: var(--color-bg);
  }


  
  /* Post container */
  .post {
    align-content: center;
  }

  /* Responsive adjustments */
  @media (max-width: 480px) {
    .body {
      padding: 1rem;
    }
  }

</style>