<script lang="ts">
    import { goto } from '$app/navigation';
	import { PUBLIC_CLOUDINARY_CLOUD_NAME, PUBLIC_CLOUDINARY_UPLOAD_PRESET } from '$env/static/public';
	import { auth, db } from '$lib/firebase/frebase.client';
	import { addDoc, collection } from 'firebase/firestore';

    let selectedFile: File | null = $state(null);
    let Formel: HTMLFormElement | null = $state(null);
    let title = $state('');
    let photo = $state('');
    let description = $state('');


    async function handleSubmit(event: Event) {
            event.preventDefault();
        const user = auth.currentUser;
        if (!user) {
            console.error("User not authenticated");
            goto("/login"); // Redirect to login if user is not authenticated
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
        const formData = {
            userId: user.uid,
            title,
            photo, // Assuming photo is a URL or base64 string
            description,
            createdAt: new Date().toISOString()
        };


        try {
            const docRef = await addDoc(collection(db, "home"), formData);
            Formel?.reset();
            goto("/login/admin_dashboard/add_post"); // Redirect to view requests after submission
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

   
    function handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            selectedFile = input.files[0];
        }
    }

</script>


<h1 class="head">Make a new post for MMC</h1>
<p class="head">Please fill out the form below to make a post.</p>
<form  bind:this={Formel} onsubmit={handleSubmit}>
    <h2>Basic Information</h2>
    <label>
        <p class="sub">Title</p>
        <input type="text" placeholder="full name" required bind:value={title} />
    </label>

    <label>
        <p class="sub">Description</p>
        <textarea placeholder="description" required bind:value={description}></textarea>
    </label>

    <label>
        <p class="span">Photo</p>
        <input
            type="file"
            accept="image/*"
            onchange={handleFileChange}
        />
    </label>
    <button type="submit">Submit</button>
    <button type="button" class="cancel" onclick={() => Formel?.reset()}>Cancel</button>
</form>

<style>

    input, textarea {
        width: 100%;
        font-size: 1rem;
        font-family: 'Inter', sans-serif;
        border-radius: 6px;
        transition: border-color 0.3s ease, background-color 0.2s ease;
        background-color: var(--color-bg);
        color: var(--color-text);
        border: 1.8px solid var(--color-accent);
        padding: 0.6rem 0.75rem;
    }

    /* Form container */
    form {
        width: 100%;
        max-width: 700px;
        margin: 2rem auto;
        padding: 2rem;
        background-color: var(--color-text);
        border-radius: 10px;
        box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        font-family: 'Inter', sans-serif;
        color: var(--color-text);
    }

    /* Typography */
    h1.head, p.head, h2 {
        color: var(--color-text-secondary);
        margin: 0.5rem 0;
    }

    .head {
        text-align: center;
        font-weight: 600;
    }

    /* Labels and fields */
    label {
        display: block;
        font-size: 1rem;
        font-weight: 500;
        color: var(--color-accent);
    }

    label p {
        color: var(--color-text-secondary);
    }

    ::placeholder {
        color: var(--color-muted);
        opacity: 0.8;
    }

    /* Focus styles */
    input:focus,
    textarea:focus {
        outline: none;
        border-color: var(--color-highlight);
        box-shadow: 0 0 5px var(--color-highlight);
    }
    /* Buttons */
    button {
        padding: 0.75rem 1.5rem;
        border-radius: var(--border-radius);
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s, color 0.3s, transform 0.1s;
        border: none;
    }

    /* Submit Button */
    button[type="submit"] {
        background-color: var(--color-highlight);
        color: var(--color-bg);
    }

    button[type="submit"]:hover {
        background-color: var(--color-warning);
        transform: scale(1.03);
    }

    /* Cancel Button */
    .cancel {
        color: var(--color-error);
        background-color: transparent;
        border: 1.5px solid var(--color-error);
    }

    .cancel:hover {
        background-color: var(--color-background-cancel-button-hover);
        transform: scale(1.03);
    }

    

    /* Textarea */
    textarea {
        min-height: 100px;
        resize: vertical;
    }


    
    /* Responsive */
    @media (max-width: 480px) {
        form {
            margin: 1.5rem;
            padding: 1.2rem;
        }

        h2 {
            font-size: 1.2rem;
        }

        input, textarea {
            padding: 0.5rem 1rem;
        }


        .head {
            font-size: 1rem;
        }
    }
</style>