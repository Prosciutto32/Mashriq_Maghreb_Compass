<script lang="ts">
	import { db, auth } from "$lib/firebase/frebase.client";
	import { onMount } from "svelte";
	import { collection, query, getDocs } from "firebase/firestore";
	import { onAuthStateChanged } from "firebase/auth";
	import { PUBLIC_CLOUDINARY_CLOUD_NAME, PUBLIC_CLOUDINARY_UPLOAD_PRESET } from '$env/static/public';

	type Value = {
		id: string;
        title: string;
		text: string;
		imageUrl: string;
		createdAt: string;
	};

	let userId: string | null = null;
	let values: Value[] = $state([]);
	let loading = $state(true);
	let error = $state("");
    let title: string = $state("");
	let text = $state("");
    let photo: string = $state("");
	let selectedFile: File | null = $state(null);
    let editingValueId: string | null = $state(null);
    let editingText: string = $state("");
    let editingImage: string = $state("");
    let editingTitle: string = $state("");
    let showEditModal: boolean = $state(false);

	onMount(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				userId = user.uid;
				await fetchValues();
			} else {
				error = "Utente non autenticato";
				loading = false;
			}
		});
		return () => unsubscribe();
	});

	async function fetchValues() {
		try {
			loading = true;
			error = "";
			values = [];
			const q = query(collection(db, "values"));
			const querySnapshot = await getDocs(q);

			values = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				title: doc.data().value_title,
				text: doc.data().value_text,
				imageUrl: doc.data().value_image,
				createdAt: doc.data().createdAt || new Date().toISOString()
			})).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
		} catch (e) {
			error = "Errore nel recupero delle richieste";
			console.error(e);
		} finally {
			loading = false;
		}
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!text || !selectedFile) {
			error = "Please enter a text and select an image.";
			return;
		}
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
                    photo = data.secure_url;
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

		try {
			const res = await fetch(`/api/values/`, {
				method: "POST",
				body: JSON.stringify({
                    value_title: title,
                    value_text: text,
                    value_image: photo,
                    createdAt: new Date().toISOString()
                }),
			});

			if (res.ok) {
				fetchValues();
			} else {
				const { error: errMsg } = await res.json();
				console.error("Errore:", errMsg);
			}
		} catch (e) {
			console.error("Errore durante la creazione:", e);
		}
	}

	function editValue(value_id: string) {
        showModal('edit', value_id);
	}

	async function deleteValue(value_id: string) {
		if(!confirm("are you sure to delete this value")) return;
		try {
			const res = await fetch(`/api/values/${value_id}`, {
				method: "DELETE"
			});

			if (res.ok) {
				fetchValues();
			} else {
				const { error } = await res.json();
				console.error("Error details:", error);
			}
		} catch (e) {
			error = "Errore nell'eliminazione del valore";
			console.error(e);
		}
	}

	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			selectedFile = input.files[0];
		}
	}

    function showModal(mode: string, valueId: string) {
        if (mode === "edit") {
            const value = values.find(v => v.id === valueId);
            if (value) {
                editingValueId = value.id;
                editingText = value.text;
                editingImage = value.imageUrl;
				editingTitle = value.title;
                showEditModal = true;
            }
        }
    }

    async function submitEdit(event: Event) {
        // Prevent default form submission
        event.preventDefault();

        if (!editingValueId || !editingText || !editingImage) return;

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
                    editingImage = data.secure_url;
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

        const res = await fetch(`/api/values/${editingValueId}`, {
            method: "PATCH",
            body: JSON.stringify({
                value_title: editingTitle,
                value_text: editingText,
                value_image: editingImage,
            })
        });

        if (res.ok) {
            showEditModal = false;
			fetchValues();
        } else {
            console.error("Failed to update value");
        }
    }

</script>



<form onsubmit={handleSubmit}>
    <input type="text" placeholder="Title value" bind:value={title}  />
	<textarea placeholder="Value Text" bind:value={text} required></textarea>
	<input type="file" accept="image/*" onchange={handleFileChange} required />
	<button type="submit">Add Value</button>

	{#if loading}
		<p class="loading">Loading...</p>
	{/if}
	{#if error}
		<p class="error">{error}</p>
	{/if}
</form>

{#if showEditModal}
    <div class="modal-overlay">
        <div class="modal">
            <h2>Edit Value</h2>
            <form onsubmit={submitEdit}>
                <input type="text"
                    bind:value={editingTitle}
                    placeholder="Edit title"
                    >
                <textarea
                    bind:value={editingText}
                    placeholder="New text"
                    required
                ></textarea>

	            <input type="file" accept="image/*" onchange={handleFileChange}  />
                <button type="submit">Update</button>
                <button type="button" class="cancel" onclick={() => showEditModal = false}>Cancel</button>
            </form>
        </div>
    </div>
{/if}

{#each values as value}
	<div class="value">
        <h3>{value.title}</h3>
		<img src={value.imageUrl} alt="Value" />
		<span>{value.text}</span>
		<div class="actions">
			<button type="button" onclick={() => editValue(value.id)}>Edit</button>
			<button type="button" class="cancel" onclick={() => deleteValue(value.id)}>Delete</button>
		</div>
	</div>
{/each}

<style>
    h3 {
        font-size: 1.2rem;
        margin-right: 0.5rem;
        color: var(--color-text);
        font-weight: 800;
        font-family: 'Inter', sans-serif;

    }
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
    }

    .modal {
        background: var(--color-surface);
        padding: 2rem;
        border-radius: 12px;
        max-width: 800px;
        width: 90%;
        box-shadow: 0 0 10px rgba(0,0,0,0.25);
        color: var(--color-text);
        font-family: 'Inter', sans-serif;
    }
	
	.value {
		background-color: var(--color-surface);
		color: var(--color-text);
		border-radius: 12px;
		padding: 1rem 1.5rem;
		margin-bottom: 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: 'Inter', sans-serif;
		box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.4);
	}
	.value img {
		width: 60px;
		height: 60px;
		object-fit: cover;
		border-radius: 8px;
		margin-right: 1rem;
	}
	.value span {
		flex: 1;
		font-weight: 600;
		font-size: 1rem;
		user-select: none;
	}
	button {
		background-color: var(--color-button-secondary);
		border: none;
		color: var(--color-text);
		padding: 0.4rem 1rem;
		margin-left: 0.5rem;
		border-radius: var(--border-radius);
		font-weight: 600;
		font-size: 0.9rem;
		cursor: pointer;
		transition: background-color 0.3s ease, color 0.3s ease, transform 0.15s ease;
	}
	button:hover {
		background-color: var(--color-highlight);
		color: var(--color-bg);
		transform: scale(1.05);
	}
	button.cancel {
		color: var(--color-error);
		border: 1.5px solid var(--color-error);
		background-color: transparent;
	}
	button.cancel:hover {
		background-color: var(--color-background-cancel-button-hover);
		color: var(--color-error);
        transform: scale(1.05);
	}
	form {
		background-color: var(--color-surface);
		padding: 1.5rem 2rem;
		border-radius: 14px;
		max-width: 600px;
		margin: 2rem auto;
		box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.4);
		display: flex;
		flex-direction: column;
		gap: 1rem;
		font-family: 'Inter', sans-serif;
		color: var(--color-text);
	}
	form textarea, form input[type="text"],
	form input[type="file"] {
		padding: 0.7rem 1rem;
		font-size: 1rem;
		border-radius: 8px;
		border: 1.8px solid var(--color-accent);
		background-color: var(--color-bg);
		color: var(--color-text);
	}
	form button[type="submit"] {
		padding: 0.75rem 1.8rem;
		background-color: var(--color-highlight);
		border: none;
		border-radius: var(--border-radius);
		font-weight: 700;
		font-size: 1rem;
		color: var(--color-bg);
		cursor: pointer;
		transition: background-color 0.3s ease, transform 0.15s ease;
	}
	form button[type="submit"]:hover {
		background-color: var(--color-warning);
		transform: scale(1.05);
	}
	.modal form textarea{
		height: 20rem;
	}
</style>
