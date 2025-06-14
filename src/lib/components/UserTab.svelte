<script lang="ts">
	import { goto } from "$app/navigation";

  export let displayName: string | null = null;
  export let email: string;
  export let role: string;
  export let uid: string;

  const deleteUser = async () => {
    if (!confirm(`Are you sure you want to delete user ${email}?`)) return;

    try {
      const res = await fetch(`/api/users/${uid}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid })
      });

      const result = await res.json();

      if (result.success) {
        alert(` User ${email} deleted.`);
        location.reload();
      } else {
        alert(` Failed to delete: ${result.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Unexpected error deleting user.');
    }
  };

  export let onUpgrade: () => void = async () => {
    if(!confirm("are you sure you want to upgrade "+email+" to staff member?")) return;
    try {
      const res = await fetch('/api/make-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const result = await res.json();

      if (result.success) {
        alert(` ${email} upgraded to staff.`);
      } else {
        alert(` Failed to upgrade: ${result.error}`);
      }
    } catch (err) {
      console.error(err);
      alert(' Unexpected error.');
    } finally {
      location.reload();
    }
  };

  export let onDowngrade: () => void = async () => {
    if(!confirm("are you sure you want to downgrade "+email+" to user ?")) return;
    try {
      const res = await fetch('/api/demote-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const result = await res.json();

      if (result.success) {
        alert(`${email} downgraded to user.`);
      } else {
        alert(` Failed to downgrade: ${result.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Unexpected error.');
    } finally {
      location.reload();
    }
  };
</script>

<div class="user-card">
  <div class="user-info">
    <h2 class="email">{email}</h2>
    <p class="username">{displayName ?? "No username"}</p>
    <span class="role-tag">{role}</span>
  </div>
  <div class="actions">
    {#if role === 'user'}
      <button class="btn upgrade" onclick={onUpgrade}>Upgrade to Staff</button>
      <button class="btn delete" onclick={deleteUser}>Delete</button>
    {:else if role === 'staff'}
      <button class="btn downgrade" onclick={onDowngrade}>Downgrade to User</button>
    {/if}
  </div>
</div>

<style>
  .user-card {
    background-color: var(--color-bg);
    color: var(--color-text);
    border-radius: 1em;
    padding: 1.5em 2em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    margin-bottom: 1em;
    flex-wrap: wrap;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    gap: 0.2em;
  }

  .email {
    font-family: 'Courier New', Courier, monospace;
    font-size: 1.2em;
    font-weight: bold;
    color: var(--color-highlight);
  }

  .username {
    font-size: 0.95em;
    color: var(--color-muted);
  }

  .role-tag {
    font-size: 0.85em;
    font-weight: 600;
    color: white;
    background-color: var(--color-muted);
    border-radius: 0.5em;
    padding: 0.2em 0.6em;
    width: fit-content;
    margin-top: 0.3em;
  }

  .actions {
    display: flex;
    gap: 1em;
    flex-wrap: wrap;
    margin-top: 1em;
  }

  .btn {
    padding: 0.5em 1.2em;
    font-size: 0.9em;
    font-weight: bold;
    border: none;
    border-radius: 0.5em;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-family: 'Courier New', Courier, monospace;
  }

  .upgrade {
    background-color: var(--color-bg-approved);
    color: var(--color-approved);
  }

  .upgrade:hover {
    transform: scale(1.03);
  }

  .downgrade {
    background-color: var(--color-warning);
    color: white;
  }

  .downgrade:hover {
    transform: scale(1.03);
  }

  .delete {
    background-color: var(--color-error);
    color: white;
  }

  .delete:hover {
    transform: scale(1.03);
  }
</style>
