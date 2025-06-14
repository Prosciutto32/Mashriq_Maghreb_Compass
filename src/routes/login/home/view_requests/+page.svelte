<script lang="ts">
  import { onMount } from "svelte";
  import { auth, db } from "$lib/firebase/frebase.client";
  import { collection, query, where, getDocs } from "firebase/firestore";
  import { onAuthStateChanged } from "firebase/auth";
  import { goto } from "$app/navigation";

  type Request = {
    id: string;
    projectTitle: string;
    status: string;
    createdAt: string;
  };

  let userId: string | null = null;
  let requests: Request[] = $state([]);
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
      }
    });

    return () => unsubscribe();
  });

  async function fetchRequests() {
    try {
      loading = true;
      error = "";
      requests = [];

      const q = query(collection(db, "requests"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      requests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        projectTitle: doc.data().projectTitle,
        status: doc.data().status,
        createdAt: doc.data().createdAt,
      }));

    } catch (e) {
      error = "Errore nel recupero delle richieste";
      console.error(e);
    } finally {
      loading = false;
    }
    // Ensure requests are sorted by createdAt in descending order
    requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }


	function handleRequestClick(id: string) {
    goto(`/login/home/view_requests/${id}`);
  }

  // Optional: handle keyboard navigation
  function handleKeyDown(event: KeyboardEvent, id: string) {
    if (event.key === "Enter" || event.key === " ") {
      handleRequestClick(id);
    }
	}
</script>

<div class="requests-list">
  {#if loading}
    <p class="loading">Caricamento richieste...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else if requests.length === 0}
    <p>Nessuna richiesta trovata.</p>
  {:else}
    {#each requests as req, i }
      <div
        tabindex={i + 1}
        role="button"
        class="request-item"
        onclick={() => handleRequestClick(req.id)}
        onkeydown={(e) => {

        }}
      >
        <div>
          <div class="title">{req.projectTitle}</div>
          <div class="created-at">{new Date(req.createdAt).toLocaleDateString()}</div>
        </div>
        <div class="status {req.status}">
          {req.status}
        </div>
      </div>
    {/each}
  {/if}
</div>

<style>
    .requests-list {
        max-width: 100%;
        margin: 2rem auto;
        font-family: 'Inter', sans-serif;
        color: var(--color-text);
    }

    .request-item {
        padding: 1rem;
        border-bottom: 1px solid var(--color-accent);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: var(--color-bg);
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        transition: background 0.2s;
    }

    .request-item:hover {
        background-color: var(--color-bg-secondary, #1a1d1b); /* fallback */
        cursor: pointer;
    }

    .title {
        font-weight: 600;
        color: var(--color-text);
        font-size: 1rem;
    }

    .status {
        text-transform: capitalize;
        font-size: 0.9rem;
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-weight: 500;
        background-color: var(--color-muted);
        color: var(--color-bg);
    }

    .status.pending {
        background-color: var(--color-highlight);
        color: var(--color-bg);
    }

    .status.approved {
        background-color: #55efc4;
        color: #003e30;
    }

    .status.rejected {
        background-color: var(--color-error);
        color: var(--color-bg);
    }
    .status.revisioning {
        background-color: var(--color-warning);
        color: var(--color-bg);
    }

    .created-at {
        font-size: 0.8rem;
        color: var(--color-muted);
        margin-top: 0.3rem;
    }

    .error {
        color: var(--color-error);
        text-align: center;
        margin-top: 2rem;
    }

    .loading {
        text-align: center;
        margin-top: 2rem;
        color: var(--color-text);
    }

</style>