<script lang="ts">
    import Request from '$lib/components/Request.svelte';
    import { auth, db } from '$lib/firebase/frebase.client';
    import type { PageProps } from './$types';
	import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { onAuthStateChanged } from 'firebase/auth';
    import type { TypeRequest } from '$lib';
    
    
    
    let { data }: PageProps= $props();
    let userId: string | null = null;
    let request_id = $state(data.id );
    let loading = $state(false);
    let error = $state('');
    let request: TypeRequest = $state({
        id: '',
        projectTitle: '',
        status: '',
        createdAt: '',
        entityType: '',
        fullName: '',
        location: '',
        phone: 0,
        serviceType: '',
        additionalInfo: '',
        projectDescription: '',
        projectRegion: '',
        projectStart: '',
        projectEnd: '',
        userId: '',
    });

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

        const docRef = doc(db, 'requests', request_id);
        const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        request = {
          id: request_id,
          projectTitle: data.projectTitle || '',
          status: data.status || '',
          createdAt: data.createdAt || '',
          entityType: data.entityType || '',
          fullName: data.fullName || '',
          location: data.location || '',
          phone: data.phone || 0,
          serviceType: data.serviceType || '',
          additionalInfo: data.additionalInfo || '',
          projectDescription: data.projectDescription || '',
          projectRegion: data.projectRegion || '',
          projectStart: data.projectStart || '',
          projectEnd: data.projectEnd || '',
          userId: data.userId || '',
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

<Request request={request} />

{#if loading}
    <p class="loading">Caricamento richiesta...</p>
{:else if error}
    <p class="error">{error}</p>
{/if}


<style>
    .loading {
        text-align: center;
        font-size: 1.2rem;
        color: var(--color-text);
    }

    .error {
        color: var(--color-error);
        text-align: center;
        font-size: 1.2rem;
    }
</style>