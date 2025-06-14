<script lang="ts">
    import { db, auth } from "$lib/firebase/frebase.client";
    import { onMount } from "svelte";
    import { collection, query, where, getDocs } from "firebase/firestore";
    import { onAuthStateChanged } from "firebase/auth";
	import type { Contact } from "$lib/types";

    let userId: string | null = null;
    let contacts: Contact[] = $state([]);
    let loading = $state(true);
    let error = $state("");
    let contactType: string = $state("");
    let contactValue: string = $state("");
    let showEditModal = $state(false);
    let editingContactId: string | null = null;
    let editingType: string = $state("");
    let editingValue: string = $state("");

    onMount(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
        userId = user.uid;
        await fetchContacts();
        } else {
        error = "Utente non autenticato";
        loading = false;
        }
    });

    return () => unsubscribe();
    });

    async function fetchContacts() {
        try {
            loading = true;
            error = "";
            contacts = [];
            // Fetch contacts
            const q = query(collection(db, "contacts"));
            const querySnapshot = await getDocs(q);

            contacts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            type: doc.data().contact_type,
            value: doc.data().contact_type === "email" ? doc.data().contact_email : doc.data().contact_type === "phone" ? doc.data().contact_phone : doc.data().contact_adress
            }));

        } catch (e) {
            error = "Errore nel recupero delle richieste";
            console.error(e);
        } finally {
            loading = false;
        }
    }
    async function handleSubmit(event: Event) {
        // Prevent default form submission
        event.preventDefault();
        // Logic to handle the submission and create a new contact
        if (!contactType || !contactValue) {
            error = "Please select a contact type and enter a value.";
            return;
        }
       const res = await fetch(`/api/contacts/`, {
           method: "POST",
           body: JSON.stringify({ contact_type: contactType, [contactType == "email" ? "contact_email" : contactType == "phone" ? "contact_phone" : "contact_adress"]: contactValue }),
       });

        if (res.ok) {
            fetchContacts();
        } else if (res.status === 400) {
            const { error } = await res.json();
        } else {
            console.error("Error creating contact:", res.statusText);
        }
    }

    function editContact(contactId: string) {
        // Logic to edit a contact
        // open a modal to edit:
        showModal('edit', contactId);
        
    }
    async function deleteContact(contactId: string) {
        // Logic to delete a contact

        if (!confirm('Are you sure you want to delete this contact?')) {
            return;
        }

         try {
            const res = await fetch(`/api/contacts/${contactId}`, {
                method: "DELETE",
                body: JSON.stringify({ id: contactId }),
            });

            if (res.ok) {

            } else {
                console.error("Error deleting contact:", res.statusText);
            }
        } catch (e) {
            error = 'Errore nell\'eliminazione del contatto';
            console.error(e);
        } finally {
            fetchContacts(); 
        }
    }


    function showModal(mode: string, contactId: string) {
        if (mode === "edit") {
            const contact = contacts.find(c => c.id === contactId);
            if (contact) {
                editingContactId = contact.id;
                editingType = contact.type;
                editingValue = contact.value;
                showEditModal = true;
            }
        }
    }

    async function submitEdit(event: Event) {
        // Prevent default form submission
        event.preventDefault();

        if (!editingContactId || !editingType || !editingValue) return;

        const res = await fetch(`/api/contacts/${editingContactId}`, {
            method: "PATCH",
            body: JSON.stringify({
                contact_type: editingType,
                [editingType === "email" ? "contact_email" : editingType === "phone" ? "contact_phone" : "contact_adress"]: editingValue
            })
        });

        if (res.ok) {
            showEditModal = false;
            fetchContacts();
        } else {
            console.error("Failed to update contact");
            error = "Failed to update contact";
        }
    }

</script>

{#if showEditModal}
    <div class="modal-overlay">
        <div class="modal">
            <h2>Edit Contact</h2>
            <form onsubmit={submitEdit}>
                <select bind:value={editingType} required>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="adress">Adress</option>
                </select>
                <input
                    type="text"
                    bind:value={editingValue}
                    placeholder="New value"
                    required
                />
                <button type="submit">Save</button>
                <button type="button" class="cancel" onclick={() => showEditModal = false}>Cancel</button>
            </form>
        </div>
    </div>
{/if}
{#if error}
    <p class= "error">{error}</p>
{/if}
<form onsubmit={handleSubmit}>
    <select name="type" required bind:value={contactType}>
        <option value="" disabled selected>Select the contact type</option>
        <option value="email">Email</option>
        <option value="phone">Phone</option>
        <option value="adress">Adress</option>
    </select>
    <input type="text" name="contact" placeholder="Contact" required bind:value={contactValue} />
    <button type="submit">Add Contact</button>
    {#if error}
        <p class="error">{error}</p>
    {/if}
</form>


{#each contacts as contact}
    <div class="contact">
        <span>{contact.type}: {contact.value}</span>
        <button type="button" onclick={() => editContact(contact.id)}>Edit</button>
        <button type="button" class="cancel" onclick={() => deleteContact(contact.id)}>Delete</button>
    </div>
{/each}





<style>
    .error{
        color: var(--color-error);
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
        max-width: 400px;
        width: 90%;
        box-shadow: 0 0 10px rgba(0,0,0,0.25);
        color: var(--color-text);
        font-family: 'Inter', sans-serif;
    }

    
    /* Container per ogni contatto */
    .contact {
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

    /* Testo tipo: valore */
    .contact span {
        font-weight: 600;
        font-size: 1rem;
        user-select: none;
    }

    /* Bottoni Edit e Delete */
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

    /* Delete button specifico */

    .cancel {
        background-color: transparent;
        border: 1.5px solid var(--color-error);
        color: var(--color-error);
    }
    .cancel:hover {
        background-color: var(--color-background-cancel-button-hover);
        color:var(--color-error);
        transform: scale(1.03);
    }

    /* Form container */
    form {
        background-color: var(--color-surface);
        padding: 1.5rem 2rem;
        border-radius: 14px;
        max-width: 600px;
        margin: 2rem auto;
        box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.4);
        display: flex;
        gap: 1rem;
        font-family: 'Inter', sans-serif;
        color: var(--color-text);
        flex-wrap: wrap;
        align-items: center;

    }

    /* Select e input con stesso stile */
    form select,
    form input[type="text"] {
        flex: 1 1 180px;
        padding: 0.7rem 1rem;
        font-size: 1rem;
        border-radius: 8px;
        border: 1.8px solid var(--color-accent);
        background-color: var(--color-bg);
        color: var(--color-text);
        transition: border-color 0.3s ease, background-color 0.2s ease;
    }

    /* Placeholder */
    form input::placeholder {
        color: var(--color-muted);
        opacity: 0.8;
    }

    /* Focus styles */
    form select:focus,
    form input:focus {
        outline: none;
        border-color: var(--color-highlight);
        box-shadow: 0 0 6px var(--color-highlight);
    }

    /* Pulsante submit */
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
        flex-shrink: 0;
        align-self: center;
    }

    form button[type="submit"]:hover {
        background-color: var(--color-warning);
        transform: scale(1.05);
    }

    /* Responsive */
    @media (max-width: 480px) {
        form {
            flex-direction: column;
            padding: 1rem;
        }
        
        form select,
        form input[type="text"],
        form button[type="submit"] {
            flex: 1 1 100%;
        }
        
        .contact {
            flex-direction: column;
            align-items: flex-start;
        }
        
        .contact button {
            margin-left: 0;
            margin-top: 0.5rem;
            width: 100px;
        }
    }

</style>