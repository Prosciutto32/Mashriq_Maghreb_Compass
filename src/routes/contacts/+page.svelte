<script lang="ts">
    import { db } from "$lib/firebase/frebase.client";
	import type { ContactCard } from "$lib/types";
	import { collection, getDocs, query, where } from "firebase/firestore";
    import { onMount } from "svelte";


    let contacts: ContactCard[] = $state([]);
    let loading = $state(true);
    let error = $state("");
    onMount(async () => {
        await fetchContacts();
    });

     async function fetchContacts() {
        try {
            loading = true;
            error = "";
            contacts = []; // Reset contacts array
            const q = query(collection(db, "contacts"),);
            const querySnapshot = await getDocs(q);

            contacts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            contact_type: doc.data().contact_type,
            // Optional fields, use undefined if not present
            contact_phone: doc.data().contact_phone || undefined,
            contact_email: doc.data().contact_email || undefined,
            contact_adress: doc.data().contact_adress|| undefined
            }));

        } catch (e) {
            error = "Errore nel recupero delle richieste";
            console.error(e);
        } finally {
            loading = false;
        }
    }
</script>
<div class="contacts-container">
    {#each contacts as contact}
        <div class="contact-item">
            <h3>{contact.contact_type}</h3>
            <div class="contact-details">
                {#if contact.contact_type === 'phone'}
                    <div class="contact-line">
                        <i class="fas fa-phone"></i>
                        <span>{contact.contact_phone}</span>
                    </div>
                {/if}
                {#if contact.contact_type === 'email'}
                    <div class="contact-line">
                        <i class="fas fa-envelope"></i>
                        <span>{contact.contact_email}</span>
                    </div>
                {/if}
                {#if contact.contact_type === 'adress'}
                    <div class="contact-line">
                        <i class="fas fa-home"></i>
                        <span>{contact.contact_adress}</span>
                    </div>
                {/if}
            </div>
        </div>
    {/each}

    {#if error}
        <p class="error">{error}</p>
    {:else if loading}
        <p class="loading">Caricamento in corso...</p>
    {/if}
</div>
<style>
    .contacts-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }

    .contact-item {
        background-color: var(--color-surface);
        border-radius: var(--border-radius);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        padding: 1.5rem 2rem;
        margin-bottom: 2rem;
        transition: transform 0.2s ease;
    }

    .contact-item:hover {
        transform: scale(1.01);
    }

    .contact-item h3 {
        font-size: 1.5rem;
        color: var(--color-text);
        margin-bottom: 1rem;
    }

    .contact-details {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
    }

    .contact-line {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        font-size: 1.1rem;
        color: var(--color-muted);
    }

    .contact-line i {
        color: var(--color-highlight);
        font-size: 1.2rem;
        width: 24px;
        text-align: center;
    }

    .error {
        color: var(--color-error);
        text-align: center;
        font-weight: bold;
    }

    .loading {
        text-align: center;
        font-style: italic;
        color: var(--color-muted);
    }

    @media (max-width: 600px) {
        .contact-item {
            padding: 1rem 1.5rem;
        }

        .contact-item h3 {
            font-size: 1.2rem;
        }

        .contact-line {
            font-size: 1rem;
        }

        .contact-line i {
            font-size: 1rem;
        }
    }
</style>
