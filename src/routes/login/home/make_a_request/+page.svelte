<script lang="ts">
    import { goto } from '$app/navigation';
	import { auth, db } from '$lib/firebase/frebase.client';
	import { addDoc, collection } from 'firebase/firestore';
    let Formel: HTMLFormElement | null = $state(null);
    let fullName = $state('');
    let phone = $state('');
    let location = $state('');
    let serviceType = $state('');
    let otherService = $state('');
    let projectTitle = $state('');
    let projectDescription = $state('');
    let projectRegion = $state('');
    let projectStart = $state('');
    let projectEnd = $state('');
    let entityType = $state('');
    let otherEntity = $state('');
    let additionalInfo = $state('');
    const phonePattern = "^[0-9+\\s()\\-]{7,20}$";



    async function handleSubmit(event: Event) {
        event.preventDefault();
        if(!confirm("are you sure to send this request?")) return;

        const user = auth.currentUser;
        if (!user) {
            console.error("User not authenticated");
            return;
        }

        const formData = {
            userId: user.uid,
            fullName,
            phone,
            location,
            serviceType: serviceType === 'other' ? otherService : serviceType,
            projectTitle,
            projectDescription,
            projectRegion,
            projectStart,
            projectEnd,
            entityType: entityType === 'other' ? otherEntity : entityType,
            additionalInfo,
            status: "pending", // inizialmente pending
            createdAt: new Date().toISOString()
        };

        try {
            const docRef = await addDoc(collection(db, "requests"), formData);
            console.log("Document written with ID: ", docRef.id);
            Formel?.reset();
            await notifyAdmin();
            await notifyStaff();
            goto("/login/home/view_requests"); // Redirect to view requests after submission
        } catch (e) {
            console.error("Error adding document: ", e);
        }

    }



    async function notifyAdmin (){
        
        let admin_emailRes = await fetch('/api/admin', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json'
            }
        });
        let admin_json = await admin_emailRes.json();
        const admin_email =  admin_json.admin;
        console.log("notifing admin: "+ admin_email);
        try {
        console.log("sending a notification to " + admin_email);
        const response = await fetch('/api/notification-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: admin_email,
                body: "a request has been asked to be revisioned"
            })
        });

        if (!response.ok) {
            console.error("Fetch failed with status", response.status);
        }

        } catch (err) {
        console.error("Error sending notification:", err);
        }
    }

    async function notifyStaff (){

        try {
            console.log("sending a notification to  the staff" );
            const response = await fetch('/api/notification-channel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    channel: "staff",
                    body: "a request has been asked to be revisioned"
                })
            });

            if (!response.ok) {
                console.error("Fetch failed with status", response.status);
            }

        } catch (err) {
        console.error("Error sending notification:", err);
        }
    }



</script>


<h1 class="head">Request a service from MMC</h1>
<p class="head">Please fill out the form below to make a request.</p>
<form bind:this={Formel} onsubmit={handleSubmit}>
    <h2>Basic Information</h2>

    <label>
        <p class="sub">Full Name *</p>
        <input
            type="text"
            name="fullName"
            placeholder="Full name"
            required
            bind:value={fullName}
        />
    </label>

    <label>
        <p class="sub">Phone Number *</p>
        <input
            type="tel"
            name="phone"
            inputmode="tel"
            pattern={phonePattern}
            placeholder="+1 234 567 890"
            required
            bind:value={phone}
        />
    </label>

    <label>
        <p class="sub">Location (City, Country) *</p>
        <input
            type="text"
            name="location"
            placeholder="City, Country"
            required
            bind:value={location}
        />
    </label>

    <h2>Type of Service Required</h2>

    <label>
        <p class="sub">What type of service you want us to provide *</p>
        <select name="serviceType" required bind:value={serviceType}>
            <option value="" disabled selected>Select a service</option>
            <option value="Needs assessment or research related to civil society, human rights, or related topics">
                Needs assessment or research related to civil society, human rights, or related topics
            </option>
            <option value="Monitoring and Evaluation of Project">
                Monitoring and Evaluation of Project
            </option>
            <option value="Getting to Know More About MMC's Work">
                Getting to Know More About MMC's Work
            </option>
            <option value="other">Other (Please specify)</option>
        </select>
        {#if serviceType === 'other'}
            <input
                type="text"
                name="otherService"
                placeholder="Please specify"
                bind:value={otherService}
            />
        {/if}
    </label>

    <h3>Project Details (if applicable)</h3>

    <label>
        <p class="sub">Project Title *</p>
        <input
            type="text"
            name="projectTitle"
            required
            placeholder="Project Title"
            bind:value={projectTitle}
        />
    </label>

    <label>
        <p class="sub">Project Description *</p>
        <textarea
            name="projectDescription"
            required
            placeholder="Describe your project or request in detail"
            bind:value={projectDescription}
        ></textarea>
    </label>

    <label>
        <p class="sub">Location/Region *</p>
        <input
            type="text"
            name="projectRegion"
            required
            placeholder="Region"
            bind:value={projectRegion}
        />
    </label>

    <label>
        <p class="sub">Estimated Duration – Project Start and End Dates *</p>
        <input type="date" name="projectStart" required bind:value={projectStart} />
        <input type="date" name="projectEnd" required bind:value={projectEnd} />
    </label>

    <label>
        <p class="sub">Entity Type (type of entity requesting the service) *</p>
        <select name="entityType" required bind:value={entityType}>
            <option value="" disabled selected>Select entity type</option>
            <option value="ngo">NGO (Non-Governmental Organization)</option>
            <option value="government">Government Institution</option>
            <option value="community">Community Group</option>
            <option value="academic">Academic/Research Institution</option>
            <option value="individual">Individual</option>
            <option value="other">Other (Please specify)</option>
        </select>
        {#if entityType === 'other'}
            <input
                type="text"
                name="otherEntity"
                placeholder="Please specify"
                bind:value={otherEntity}
            />
        {/if}
    </label>

    <label>
        <p class="sub">Additional Information</p>
        <textarea
            name="additionalInfo"
            placeholder="Any additional information or specific requirements"
            bind:value={additionalInfo}
        ></textarea>
    </label>

    <h2>Commitment</h2>
    <div class="checkbox-wrapper">
        <input type="checkbox" required id="consent" name="consent" />
        <label for="consent">
            I consent to share my contact information solely for this request, in accordance with the privacy policy of MMC *
        </label>
    </div>

    <br />
    <div class="buttons">
        <button type="submit">Submit Request</button>
        <button
            type="button"
            class="cancel"
            onclick={() => {
                Formel?.reset();
                goto("/login/home/make_a_request");
            }}
        >
            Cancel
        </button>
    </div>
</form>


<style>

    input, select, textarea {
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
    h1.head, p.head, h2, h3 {
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
    select:focus,
    textarea:focus {
        outline: none;
        border-color: var(--color-highlight);
        box-shadow: 0 0 5px var(--color-highlight);
    }

    /* Special input types */
    input[type="date"] {
        cursor: pointer;
    }

    input[type="date"]::-webkit-calendar-picker-indicator {
        filter: invert(1);
        opacity: 0.7;
    }

    input[type="date"]::-moz-focus-inner,
    input[type="date"]::-moz-focusring {
        color: var(--color-text);
    }

    /* Select */
    select {
        appearance: none;
        background-repeat: no-repeat;
        background-position: right 1rem center;
        background-size: 1rem;
        font-weight: 500;
        cursor: pointer;
    }

    option {
        background-color: var(--color-bg);
        color: var(--color-text);
    }

    /* Textarea */
    textarea {
        min-height: 100px;
        resize: vertical;
    }

    /* Checkbox */
    .checkbox-wrapper {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        color: var(--color-text-secondary);
    }

    input[type="checkbox"] {
        accent-color: var(--color-accent);
        width: 1.1rem;
        height: 1.1rem;
    }

    /* Buttons */
    .buttons {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
        justify-content: space-between;
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
        max-width: 320px;
    }

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

    /* Responsive */
    @media (max-width: 480px) {
        form {
            margin: 1.5rem;
            padding: 1.2rem;
        }

        h2, h3 {
            font-size: 1.2rem;
        }

        input, select, textarea {
            padding: 0.5rem 1rem;
        }

        button {
            padding: 0.5rem 1.2rem;
        }

        .head {
            font-size: 1rem;
        }
    }
</style>