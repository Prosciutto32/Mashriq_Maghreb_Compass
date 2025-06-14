<script lang="ts">
    import { goto } from "$app/navigation";
    export let photoURL: string = '';
    export let name: string = '';
    export let link: string = '';
</script>


<button class="user" type="button" onclick={() => goto(link)}>
    <img class="user-img" src={photoURL} alt="userimg">
    <h1>{name}</h1>
</button>


<style>
    .user {
        background-color: var(--color-accent);
        color: var(--color-bg);
        padding: 1rem;
        display: flex;
        gap: 1rem;
        align-items: center;
        border-radius: 10px;
        border: none;
        cursor: pointer;
        width: 100%;
        text-align: left;
    }

    .user:focus {
        outline: 2px solid var(--color-bg);
        outline-offset: 2px;
    }

    .user-img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
</style>