<script lang="ts">
    import { db } from "$lib/firebase/frebase.client";
	import type { Post } from "$lib/types";
	import { collection, getDocs, query, where } from "firebase/firestore";
    import { onMount } from "svelte";

    let posts: Post[] = $state([]);
    let loading = $state(true);
    let error = $state("");
    onMount(async () => {
        await fetchHome();
    });

     async function fetchHome() {
        try {
            loading = true;
            error = "";
            posts = [];
            // Fetch posts
            const q = query(collection(db, "home"), where("createdAt", "!=", null));
            const querySnapshot = await getDocs(q);

            posts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            title: doc.data().title,
            createdAt: doc.data().createdAt,
            description: doc.data().description,
            photo: doc.data().photo
            }));

        } catch (e) {
            error = "Error fetching posts";
            console.error(e);
        } finally {
            loading = false;
        }
    }
</script>
<div class="posts-container">
    {#if error}
        <p class="error">{error}</p>
    {:else}
        {#each posts as post, i}
            <div class="post {i % 2 === 0 ? 'normal' : 'reversed'}">
                <div class="post-image">
                    <img src={post.photo} alt={post.title} />
                </div>
                <div class="post-content">
                    <h2>{post.title}</h2>
                    <div class="underline"></div>
                    <p>{post.description}</p>
                </div>
            </div>
        {/each}
    {/if}
</div>

<style>
    .error{
        color:var(--color-error);
    }

    .posts-container {
        max-width: 1100px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }

    .post {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 3rem 0;
        gap: 2rem;
        background-color: var(--color-surface);
        border-radius: var(--border-radius);
        padding: 2rem;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        flex-wrap: wrap;
    }
    .post:hover {
        transform: scale(1.02);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
    }

    .post.reversed {
        flex-direction: row-reverse;
    }

    .post-image {
        flex: 1;
        min-width: 300px;
        max-width: 500px;
        display: flex;
        justify-content: left;
    }

    .post-image img {
        width: 100%;
        height: 300px;
        object-fit: cover;
        border-radius: var(--border-radius);
    }

    .post-content {
        flex: 1;
        min-width: 280px;
        color: var(--color-text);
    }

    .post-content h2 {
        font-size: 2rem;
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

    .post-content p {
        font-size: 1rem;
        line-height: 1.6;
        color: var(--color-muted);
    }

    @media (max-width: 768px) {
        .post,
        .post.reversed {
            flex-direction: column;
            text-align: center;
        }

        .post-image img {
            height: 200px;
        }
    }
</style>
