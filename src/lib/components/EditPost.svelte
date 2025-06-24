<script lang="ts">
	import { goto } from "$app/navigation";
	import { PUBLIC_CLOUDINARY_CLOUD_NAME, PUBLIC_CLOUDINARY_UPLOAD_PRESET } from "$env/static/public";
	import type { Post } from "$lib";
	import { db } from "$lib/firebase/frebase.client";
	import { doc, updateDoc } from "firebase/firestore";
	import { onMount } from "svelte";
	import { on } from "svelte/events";

    let { post_id, post, fetchFunction }: { post_id: string, post: Post,  fetchFunction: Function} = $props();

    let loading = $state(false);
    let new_title = $state('');
    let new_description = $state('');
    let new_photo = $state('');
    let selectedFile: File | null = $state(null);
    let error = $state('');

    $effect(()=> {
        if (post) {
            new_title = post.title;
            new_description = post.description;
            new_photo = post.photo;
        }
    });

    async function updatePost(event: Event) {
    // Prevent default form submission
    event.preventDefault();
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", PUBLIC_CLOUDINARY_UPLOAD_PRESET);

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
          method: "POST",
          body: formData
        });

        const data = await res.json();
        if (data.secure_url) {
          new_photo = data.secure_url;
          console.log("Image uploaded to Cloudinary:", new_photo);
        } else {
          alert("Failed to upload image");
          return;
        }
      } catch (err) {
        console.error("Upload error", err);
        alert("Image upload failed");
        return;
      }
    }
    loading = true;
    error = '';
    new_title = new_title.trim() || post.title;
    new_description = new_description.trim() || post.description;
    new_photo = new_photo.trim() || post.photo;
    try {
      const res = await fetch(`/api/posts/${post_id}`, {
          method: "PATCH",
          body: JSON.stringify({ id: post_id, title: new_title, description: new_description, photo: new_photo }),
        });

      if (res.ok) {
        console.log("Post updated successfully");
        fetchFunction();
      } else {
        console.error("Error updating post:", res.statusText);
      }
    } catch (e) {
      error = 'Errore nell\'aggiornamento del post';
      console.error(e);
    } finally {
      loading = false;
    }
  }

  async function deletePost() {
    if(!confirm("Sei sicuro di voler eliminare questo post?")) 
      return;

    const res = await fetch(`/api/posts/${post_id}`, {
          method: "DELETE",
          body: JSON.stringify({ id: post_id })
        });

      if (res.ok) {
        console.log("Post deleted successfully");
        location.reload();
      } else {
        console.error("Error deleting post:", res.statusText);
      }
  }

  function handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            selectedFile = input.files[0];
            console.log("Selected file:", selectedFile);
        }
    }
</script>
<form onsubmit={updatePost}>
      <label>
          Title:
          <input type="text" bind:value={new_title} />
      </label>
      <label>
          Description*:
          <textarea bind:value={new_description} required></textarea>
      </label>
      <label>
          Photo*:
          <input
              type="file"
              accept="image/*"
              onchange={handleFileChange}
              required
          />
      </label>
      

      <div class="buttons">
        {#if post_id == "mission"}
            <button type="submit">Update Mission</button>
        {:else if post_id == "vision"}
            <button type="submit">Update Vision</button>
        {:else if post_id == "values"}
            <button type="submit">Update Values</button>
        {:else}
            <button type="submit">Update Post</button>
            <button type="button" class="cancel" onclick={deletePost}>Delete Post</button>
        {/if}
      </div>
  </form>

<style>
    /* Form container */
  form {
    width: 100%;
    max-width: 700px;
    margin: 2rem 0.5rem 4rem;
    padding: 2rem;
    background-color: var(--color-text);
    border-radius: 10px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    color: var(--color-text);
    font-weight: 500;
    font-size: 1rem;
  }

  /* Labels */
  label {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    color: var(--color-accent);
    font-weight: 600;
  }

  /* Inputs and textarea */
  input[type="text"] {
    width: 100%;
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    border-radius: 6px;
    border: 1.8px solid var(--color-accent);
    background-color: var(--color-bg);
    color: var(--color-text);
    padding: 0.6rem 0.75rem;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }
  textarea {
    width: 100%;
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    border-radius: 6px;
    border: 1.8px solid var(--color-accent);
    background-color: var(--color-bg);
    color: var(--color-text);
    padding: 0.6rem 0.75rem;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    resize: vertical;
    min-height: 200px;

  }

  input[type="file"] {
    padding: 0.3rem 0.75rem;
    border-radius: 6px;
    border: 1.8px solid var(--color-accent);
    background-color: var(--color-bg);
    color: var(--color-text);
    cursor: pointer;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }

  input::placeholder,
  textarea::placeholder {
    color: var(--color-muted);
    opacity: 0.8;
  }

  /* Focus styles */
  input[type="text"]:focus,
  textarea:focus,
  input[type="file"]:focus {
    outline: none;
    border-color: var(--color-highlight);
    box-shadow: 0 0 6px var(--color-highlight);
  }

  /* Buttons */
  .buttons {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    justify-content: flex-start;
  }

  button {
    padding: 0.75rem 1.5rem;
    border-radius: var(--border-radius, 6px);
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease, transform 0.1s ease;
    border: none;
    user-select: none;
    max-width: 160px;
  }

  /* Submit button */
  button[type="submit"] {
    background-color: var(--color-highlight);
    color: var(--color-bg);
    align-self: flex-start;
  }

  button[type="submit"]:hover {
    background-color: var(--color-warning);
    transform: scale(1.03);
  }

  /* Cancel/Delete button */
  .cancel {
    background-color: transparent;
    color: var(--color-error);
    border: 1.5px solid var(--color-error);
    margin-left: 1rem;
  }

  .cancel:hover {
    background-color:var(--color-background-cancel-button-hover);
    transform: scale(1.03);
  }
  @media (max-width: 600px) {
    form {
      margin: 1.5rem auto 3rem;
      padding: 1.2rem;
    }

    input[type="text"],
    textarea,
    input[type="file"] {
      padding: 0.5rem 1rem;
    }

    button {
      max-width: 100%;
      width: 100%;
    }

    button[type="button"] {
      margin-left: 0;
    }
  }

</style>
