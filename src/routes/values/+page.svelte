<script lang="ts">
    import { db } from "$lib/firebase/frebase.client";
	import { collection, getDocs, query, where } from "firebase/firestore";
    import { onMount } from "svelte";
    import type { Post } from "$lib/types";
    let values: Post[] = $state([]);
    let loading = $state(true);
    let error = $state("");
    onMount(async () => {
        await fetchValues();
    });

     async function fetchValues() {
        try {
            loading = true;
            error = "";
            values = []; // Reset values array
            const q = query(collection(db, "values"));
            const querySnapshot = await getDocs(q);

            values = querySnapshot.docs.map(doc => ({
                id: doc.id,
                title: doc.data().value_title,
                description: doc.data().value_text,
                photo: doc.data().value_image,
                createdAt: doc.data().createdAt 
            })).sort((a, b) =>  new Date(a.createdAt).getTime()-new Date(b.createdAt).getTime());

        } catch (e) {
            error = "Errore nel recupero delle richieste";
            console.error(e);
        } finally {
            loading = false;
        }
    }
</script>
<div class="timeline">
    {#each values as value, i}
        <div class="timeline-item {i % 2 === 0 ? 'left' : 'right'}">
            <div class="timeline-content">
                {#if i % 2 === 0}
                    <div class="text">
                        <h2>{value.title}</h2>
                        <div class="underline"></div>
                        <p>{value.description}</p>
                    </div>
                    <div class="image">
                        <img src={value.photo} alt={value.title} />
                    </div>
                {:else}
                    <div class="image">
                        <img src={value.photo} alt={value.title} />
                    </div>
                    <div class="text">
                        <h2>{value.title}</h2>
                        <div class="underline"></div>
                        <p>{value.description}</p>
                    </div>
                {/if}
            </div>
        </div>
    {/each}
</div>

<style>
    .timeline {
        position: relative;
        max-width: 1100px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }

    .timeline::after {
        content: '';
        position: absolute;
        width: 4px;
        background-color: var(--color-highlight);
        top: 0;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
    }

    .timeline-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        position: relative;
        width: 100%;
        margin: 2rem 0;
    }

    .timeline-item::before {
        content: '';
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 20px;
        background-color: var(--color-highlight);
        border: 4px solid white;
        border-radius: 50%;
        z-index: 1;
    }

    /* Shared timeline-content setup */
    .timeline-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

    .timeline-item.left .text,
    .timeline-item.right .image {
        order: 1;
        flex-basis: 45%;
    }

    .timeline-item.left .image,
    .timeline-item.right .text {
        order: 2;
        flex-basis: 45%;
    }

    .text {
        background: var(--color-surface);
        border-radius: var(--border-radius);
        padding: 1.5rem;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }
    .text:hover {
        transform: scale(1.02);
        transition: transform 0.3s ease;
    }

    .text h2 {
        font-size: 1.8rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
        color: var(--color-text);
    }

    .underline {
        width: 40px;
        height: 4px;
        background-color: var(--color-highlight);
        margin-bottom: 1rem;
    }

    .text p {
        font-size: 1rem;
        line-height: 1.6;
        color: var(--color-muted);
    }

    /* Image container general adjustments */
    .image img {
        width: 100%;
        height: auto;
        max-height: 400px; /* Limit image height on desktop */
        border-radius: var(--border-radius);
        object-fit: cover;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        transition: transform 0.3s ease;
    }
    .image img:hover {
        transform: scale(1.02);
    }

    /* Mobile: stack content and reduce image size */
    @media (max-width: 768px) {
        .timeline::after {
            left: 8px;
        }

        .timeline-item {
            flex-direction: column;
            align-items: flex-start;
        }
        .timeline-item.left .image,
        .timeline-item.right .image {
            order: 1;
            flex-basis: 45%;
        }

        .timeline-item.left .text,
        .timeline-item.right .text {
            order: 2;
            flex-basis: 45%;
        }
        .timeline-item.left .text,
        .timeline-item.right .text,
        .timeline-item.left .image,
        .timeline-item.right .image {
            flex-basis: 100%;
            width: 100%;
        }

        .timeline-content {
            flex-direction: column;
        }

        .timeline-item::before {
            left: 0;
            transform: none;
        }

        /* 👇 Limit image height and add spacing for mobile */
        .image img {
            max-height: 200px;
            margin-top: 1rem;
        }

        /* 👇 Adjust padding in text box */
        .text {
            padding: 1rem;
        }

        .text h2 {
            font-size: 1.5rem;
        }

        .text p {
            font-size: 0.95rem;
        }
    }

</style>