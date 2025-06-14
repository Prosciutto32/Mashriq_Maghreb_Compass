
<script lang="ts">
    import { onMount } from "svelte";
    import { auth } from "$lib/firebase/frebase.client";
    import { authHandler } from "$lib/store/server.store";
    import { PUBLIC_CLOUDINARY_CLOUD_NAME, PUBLIC_CLOUDINARY_UPLOAD_PRESET } from "$env/static/public";
	import UserCard from "./UserCard.svelte";
	

	let nottifPermGranted: boolean | null = $state(null);
	let isSubscribed = $state(false);
    let Name = $state("");
    let Saved_Name = $state("");
    let Saved_photoURL = $state("");
    let user: any = $state(null);
    let selectedFile: File | null = $state(null);
    let newEmail = $state("");
    let newPassword = $state("");
    let confirmPassword = $state("");


    onMount(async () =>  {
        console.log("Mounting User");
        const unsubscribe = auth.onAuthStateChanged(async (u) => {
            user = u;
            if (!user) {
                window.location.href = "/login";
                return;
            }
            Saved_Name = user.displayName ?? user.email ?? "name";
            Saved_photoURL = user.photoURL ?? "/logo.svg";
            console.log("User:", Saved_Name, "Photo:", Saved_photoURL);
        });
        nottifPermGranted = Notification.permission === 'granted';

		if (nottifPermGranted) {
			isSubscribed = await checkSubscriptionStatus();

			if (!isSubscribed) {
				await subscribeUser();
			}
		}
    });

    function requestNotificationPermission() {
        console.log("testin permission");
		Notification.requestPermission().then((permission) => {
			if (permission === 'granted') {
				new Notification('You are now subscribed to notifications!');
			}
		});
	}

	async function sendSubscriptionToServer(subscription: PushSubscription) {
        try {
            const token = await user.getIdToken(); 

            const res = await fetch('/api/add-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ subscription })
            });

            if (!res.ok)
                throw new Error(`Error saving subscription on server: ${res.statusText} (${res.status})`);
        } catch (error) {
            console.error('Error saving subscription on server:', error);
            await unsubscribe(); // assicurati che questa sia definita
        }
    }


	async function checkSubscriptionStatus() {
		if ('serviceWorker' in navigator) {
			const registration = await navigator.serviceWorker.ready;
			const subscription = await registration.pushManager.getSubscription();
			console.log('Subscription:', subscription);
			const exists = subscription !== null;
			if (exists) {
				// just to make sure the subscription is saved on the server
				sendSubscriptionToServer(subscription);
			}
			return exists;
		}
		return false;
	}

	async function subscribeUser() {
		if ('serviceWorker' in navigator) {
			try {
				const res = await fetch('/api/vapid-pubblic-key');
				const { data } = await res.json();

				const registration = await navigator.serviceWorker.ready;
				const subscription = await registration.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: data
				});
				isSubscribed = true;
				console.log('Subscription:', JSON.stringify(subscription));
				sendSubscriptionToServer(subscription);
			} catch (err) {
				console.error('Error subscribing:', err);
			}
		}
	}

	async function unsubscribe() {
		if ('serviceWorker' in navigator) {
			const registration = await navigator.serviceWorker.ready;
			const subscription = await registration.pushManager.getSubscription();
			if (subscription) {
				await subscription.unsubscribe();
				isSubscribed = false;
			}
		}
	}

   async function handleUpdate() {
        if (!user) {
            alert("Utente non autenticato.");
            return;
        }

        let somethingChanged = false;

        // Aggiorna nome e foto profilo (Cloudinary)
        let updatedName = Name.trim() || Saved_Name;
        let updatedPhotoURL = Saved_photoURL;

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
                    updatedPhotoURL = data.secure_url;
                    somethingChanged = true;
                    console.log("Image uploaded to Cloudinary:", updatedPhotoURL);
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

        if (updatedName !== Saved_Name || updatedPhotoURL !== Saved_photoURL) {
            await authHandler.updateProfile(user, updatedName, updatedPhotoURL);
            Saved_Name = updatedName;
            Saved_photoURL = updatedPhotoURL;
            somethingChanged = true;
        }

        // Aggiorna email se diversa
        if (newEmail && newEmail !== user.email) {
            try {
                await authHandler.updateEmail(user, newEmail);
                somethingChanged = true;
            } catch (err) {
                console.error("Email update failed", err);
                alert("Errore aggiornando l'email: " + (err instanceof Error ? err.message : String(err)));
                return;
            }
        }

        // Aggiorna password se fornita e combacia
        if (newPassword || confirmPassword) {
            if (newPassword !== confirmPassword) {
                alert("Le password non corrispondono.");
                return;
            }
            if (newPassword.length < 6) {
                alert("La password deve essere lunga almeno 6 caratteri.");
                return;
            }
            try {
                await authHandler.updatePassword(user, newPassword);
                somethingChanged = true;
            } catch (err) {
                console.error("Password update failed", err);
                alert("Errore aggiornando la password: " + (err instanceof Error ? err.message : String(err)));
                return;
            }
        }

        if (somethingChanged) {
            alert("Profilo aggiornato con successo.");
        } else {
            alert("Nessuna modifica da salvare.");
        }
    }


    function handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            selectedFile = input.files[0];
            console.log("Selected file:", selectedFile);
        }
    }

    async function testNotification() {
        await fetch('/api/notification-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: user.email,
                body: "test notification"
            })
        });
    }

    

</script>


    <div class="content-column">
        <div class="content">
            <UserCard
                name={Saved_Name}
                photoURL={Saved_photoURL}/>

            <h1>Welcome to your profile</h1>
            <p>Here you can update your profile information</p>
            
            <form >
                <label>
                    <p class="span">User Name</p>
                    <input type="text" placeholder="User Name" bind:value={Name} required/>
                </label>
                <label>
                    <p class="span">Photo</p>
                    <input
                        type="file"
                        accept="image/*"
                        onchange={handleFileChange}
                    />
                </label>
                <label>
                    <p class="span">Email</p>
                    <input type="email" placeholder="New Email" bind:value={newEmail} />
                </label>

                <label>
                    <p class="span">Nuova Password</p>
                    <input type="password" placeholder="New Password" bind:value={newPassword} />
                </label>

                <label>
                    <p class="span">Conferma Password</p>
                    <input type="password" placeholder="Confirm Password" bind:value={confirmPassword} />
                </label>
                {#if newPassword && confirmPassword && newPassword !== confirmPassword}
                    <p class="error">Passwords do not match</p>
                {/if}


                <button type="submit" onclick={()=>handleUpdate()}>Update</button>
            </form>
            {#if nottifPermGranted === null}
				<p>Checking permissions...</p>
			{:else if nottifPermGranted === false}
				<button class="button" type="button" onclick={requestNotificationPermission}
					>Enable notifications</button
				>
			{:else}
				<p>
					You have enabled notification permissions. Remove the permission in your browser
					settings...
				</p>
				{#if isSubscribed}
					<div class="notification">
						<button class="button" type="button" onclick={unsubscribe}>Unsubscribe</button>
						<button class="button" type="button" onclick={testNotification}>Test Notification</button>
					</div>
                {:else}
                    <div>
						<button class="button" type="button" onclick={subscribeUser}>Subscribe</button>
					</div>
				{/if}

			{/if}
        </div>
    </div>


<style>

   .content-column {
        width: 100%;
        height: 100%;
        padding: 2rem;
        background-color: var(--color-muted);
        border-bottom-right-radius: 10px;
        border-top-right-radius: 10px;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }

    .content {
        width: 100%;
        max-width: 700px;
        background-color: var(--color-text);
        padding: 2rem;
        border-radius: 10px;
        box-shadow: inset 0 0 10px rgb(0 0 0 / 0.05);
        box-sizing: border-box;
    }

    h1 {
        margin-top:0.5rem;
        margin-bottom: 0.5rem;
        font-size: 1.8rem;
        color: var(--color-text-secondary);
    }

    p {
        margin-bottom: 1.2rem;
        font-size: 1.1rem;
        color: var(--color-text-secondary);
    }

    /* Form labels e input styling */
    form label {
        display: block;
        margin-bottom: 1.5rem;
    }

    form label p {
        margin: 0 0 0.3rem 0;
        font-weight: 600;
        color: var(--color-accent);
    }

    /* Input generico */
    form input[type="text"],
    form input[type="email"],
    form input[type="password"],
    form input[type="file"] {
        width: 100%;
        padding: 0.6rem 0.75rem;
        font-size: 1rem;
        border: 1.8px solid var(--color-accent);
        border-radius: 6px;
        background-color: var(--color-bg);
        color: var(--color-text);
        transition: border-color 0.3s ease;
    }

    form input:focus {
        outline: none;
        border-color: var(--color-highlight);
        box-shadow: 0 0 5px var(--color-highlight);
    }

    form input[type="file"] {
        padding: 0.3rem 0.5rem;
    }

    /* Error message */
    .error {
        color: red;
        font-weight: bold;
        font-size: 0.9rem;
        margin-top: -1rem;
        margin-bottom: 1.2rem;
    }

    /* Submit & susccribe to notification buttons*/
    button {
        padding: 10px 20px;
        border-radius: 6px;
        border: none;
        background-color: var(--color-highlight);
        color: var(--color-bg);
        margin: 1rem;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.3s ease;
    }

    button:hover {
        transform: scale(1.03);
    }

    /* Label positioning: sopra o centrato */
    

    .span {
        font-size: 1rem;
        color: var(--color-text-secondary);
    }

    /*notification buttons*/
    .notification{
        display: flex;
        justify-content: space-between;
    }
</style>
