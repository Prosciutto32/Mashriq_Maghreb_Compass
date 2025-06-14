<script lang="ts">
  import type { TypeRequest } from "$lib";
  import { db } from "$lib/firebase/frebase.client";
  import { getAuth } from "firebase/auth";
  import { doc, updateDoc } from "firebase/firestore";
  import { onMount } from "svelte"; 

  let admin = $state(false);
  let staff = $state(false);
  let admin_email = $state("admin_email");

  onMount(() => {
    console.log("Mounting User");
    const auth = getAuth();
    const unsuscribe = auth.onAuthStateChanged(async (user) => {
      const currPath = window.location.pathname;
      if (user) {
        user.getIdTokenResult(true) // true forces token refresh
          .then((idTokenResult) => {
            // Access custom claims
            if (idTokenResult.claims.admin) {
              console.log('User is admin');
              admin = true;
              // If user is admin, redirect to admin dashboard
              return;
            }
            if (idTokenResult.claims.staff) {
              console.log('User is staff');
              staff = true;
              // If user is staff, redirect to staff dashboard
              return;
            }
          });
      }
    });
  });

  let { request }: { request: TypeRequest } = $props();

  async function handleRevisionClick() {
    
    await notifyAdmin();
    
    const requestRef = doc(db, 'requests', request.id);
    await updateDoc(requestRef, {
      status: 'revisioning'
    });
    // refresh the page   
    window.location.reload();
  }

  async function handleApproveClick() {
    await notifyUserRequest(request.userId, "your request has been accepted");
    const requestRef = doc(db, 'requests', request.id);
    await updateDoc(requestRef, {
      status: 'approved'
    });
    // refresh the page   
    window.location.reload();
  }

  async function handleRejectClick() {
    await notifyUserRequest(request.userId,  "your request has been rejected");
    const requestRef = doc(db, 'requests', request.id);
    await updateDoc(requestRef, {
      status: 'rejected'
    });
    // refresh the page   
    window.location.reload();
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

  async function notifyUserRequest(user_id: string, body:string) {
    try{
      const userRes = await fetch(`/api/users/${user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid:user_id,
      })
      });


    const { user } = await userRes.json();
    const email = user.email;
      console.log("nofying user :" + email);
    // Now send the notification
    await fetch('/api/notification-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        body: body
      })
    });
    }catch (err) {
      console.error("Error sending notification:", err);
    }
    console.log("user notified");
  }

</script>

<div class="request-card">
  <h2>{request.projectTitle}</h2>

  <div class="info-line">
    Requested by <strong>{request.fullName}</strong> — Tel. {request.phone}
  </div>

  <div class="tags">
    <span class="status {request.status}">{request.status}</span>
  </div>
  <div><strong>Entity:</strong> {request.entityType}</div>
  <div><strong>ServiceType:</strong> {request.serviceType}</div>
  <div><strong>Location:</strong> {request.location}</div>

  <div class="dates">
    <div><strong>Region:</strong> {request.projectRegion}</div>
    <div><strong>Start:</strong> {request.projectStart}</div>
    <div><strong>End:</strong> {request.projectEnd}</div>
  </div>

  <p class="description">{request.projectDescription}</p>
  
  {#if request.additionalInfo}
    <div class="additional">
      <strong>Additional Info:</strong> {request.additionalInfo}
    </div>
  {/if}
  <div class="end">
    <div class="timestamp">
      Submitted on: {new Date(request.createdAt).toLocaleDateString()}
    </div>
    {#if request.status.trim() == 'rejected' && (!admin && !staff)}
      <button class="revision" onclick={handleRevisionClick}>ask a revision</button>
      
    {/if}
    {#if request.status.trim() == 'pending' && (admin || staff)}
      <button class="approve" onclick={handleApproveClick}>Approve</button>
      <button class="reject" onclick={handleRejectClick}>Reject</button>
    {/if}
    {#if request.status.trim() == 'revisioning'&& (admin )}
      <button class="approve" onclick={handleApproveClick}>Approve</button>
      <button class="reject" onclick={handleRejectClick}>Reject</button>
    {/if}
  </div>
</div>

<style>
  .request-card {
    background-color: var(--color-bg);
    color: var(--color-text);
    border: 1px solid var(--color-accent);
    border-radius: var(--border-radius);
    padding: 1.5em;
    margin: 1em 0;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }

  .request-card h2 {
    font-size: 1.4em;
    margin-bottom: 0.5em;
    color: var(--color-highlight);
  }

  .info-line {
    font-size: 0.95em;
    margin-bottom: 1em;
    color: var(--color-muted);
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    gap: 0.5em;
    margin-bottom: 1em;
  }

  .dates {
    font-size: 0.9em;
    color: var(--color-text);
    margin-bottom: 1em;
  }

  .description {
    white-space: pre-line;
    line-height: 1.4;
    font-size: 1em;
    margin-bottom: 1em;
  }

  .additional {
    font-size: 0.9em;
    color: var(--color-highlight);
    margin-bottom: 1em;
  }

  .timestamp {
    font-size: 0.8em;
    color: var(--color-muted);
    padding-top: 0.5em;
    margin-top: 1em;
  }

  .status {
    text-transform: capitalize;
    font-size: 0.9rem;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-weight: 500;
    background-color: var(--color-muted);
    color: var(--color-bg);
  }

  .status.pending {
    background-color: var(--color-highlight);
    color: var(--color-bg);
  }

  .status.approved, .approve  {
    background-color: var(--color-bg-approved);
    color: var(--color-approved);
  }

  .revision{
    background-color: var(--color-highlight);
    color: var(--color-bg);
  }

  .status.rejected, .reject {
    background-color: var(--color-error);
    color: var(--color-bg);
  }

  .status.revisioning {
    background-color: var(--color-warning);
    color: var(--color-bg);
  }

  

  .end {
    border-top: 1px solid var(--color-accent);
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1em;
  }
  button {
    padding: 10px 20px;
    border-radius: 6px;
    border: none;
    background-color: var(--color-muted);
    color: var(--color-text);
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
  }

  button:hover {
    transform: scale(1.03);
  }
</style>
