<script lang="ts">
    import type { Post } from '$lib';
    let { post }: { post: Post } = $props();
</script>

<div class="post-container">
    <h1 class="post-title">{post.title}</h1>
    <p class="post-description">{post.description}</p>
    {#if post.photo}
        <img src={post.photo} alt={post.title} class="post-image" />
    {/if}
    <p class="post-date">Created at: {new Date(post.createdAt).toLocaleDateString()}</p>
</div>


<style>
    .post-container {
        max-width: 700px;
        margin: 2rem auto;
        padding: 2rem;
        background-color: var(--color-text);
        border-radius: 12px;
        box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.07);
        color: var(--color-bg);
        font-family: 'Inter', sans-serif;
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
        user-select: none;
    }

    .post-title {
        font-size: 2rem;
        font-weight: 700;
        color: var(--color-highlight);
        margin: 0;
        text-align: center;
    }

    .post-description {
        font-size: 1.125rem;
        line-height: 1.6;
        color: var(--color-bg);
        white-space: pre-wrap;
    }

    .post-image {
        width: 100%;
        max-height: 400px;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
        margin: 1rem 0;
        user-select: none;
    }

    .post-date {
        font-size: 0.9rem;
        color: var(--color-muted);
        text-align: right;
        font-style: italic;
    }

        /* Responsive */
    @media (max-width: 480px) {
        .post-container {
            padding: 1.2rem 1rem;
        }

        .post-title {
            font-size: 1.5rem;
        }

        .post-description {
            font-size: 1rem;
        }
    }

</style>




