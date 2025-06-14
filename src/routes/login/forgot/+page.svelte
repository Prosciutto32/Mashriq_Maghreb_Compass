<script>
    import { goto } from "$app/navigation";
    import { authHandler } from "$lib/store/server.store";
    let email = $state('');
    async function handleForgotPassword() {
        if (!email) {
            alert("Please enter your email");
            return;
        }
        try {
            await authHandler.forgotPassword(email);
            alert(" Reset link sent to: " + email);
            goto("/login");
        } catch (e) {
            console.error("Error sending reset link:", e);
        }
    }
    
</script>

<div class="authContainer">
    <form>
        <h1>Forgot Password</h1>
        
        <label>
            <p class={email ? "above" : "center"}>Email</p>
            <input type="email" placeholder="email" required bind:value={email} />
        </label>

        <button type="submit" onclick={()=>handleForgotPassword()}>
            Send Reset Link
        </button>
        <div class="options">
            <button  onclick={() => goto("/login")}>
                go to login
            </button>
            
        </div>
    </form>
</div>

<style>
    .authContainer {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 14px;
        width: 25rem;
        max-width: 100%;
        margin: 0 auto;
        padding: 20px;
        border-radius: 10px;
        background-color: var(--color-bg);
    }

    form label {
        animation: none;
        position: relative;
        border: 0.05rem solid var(--color-accent);
        border-radius: 1rem;
        padding-top: 14px; /* spazio per l'etichetta sopra */
        padding-bottom: 4px;
    }

    form input {
        width: 100%;
        padding: 10px 10px 6px 10px;
        border-radius: 5px;
        border: none;
        background-color: transparent;
        color: var(--color-text);
        font-size: 1rem;
    }

    form input:focus {
        outline: none;
        box-shadow: none;
    }

    h1 {
        text-align: center;
        color: var(--color-text);
    }

    form button {
        padding: 10px;
        border-radius: 5px;
        border: none;
        background-color: var(--color-muted);
        color: var(--color-text);
        cursor: pointer;
        font-size: 1rem;
    }

    form button:hover {
        background-color: var(--color-accent);
    }

    label p {
        position: absolute;
        left: 10px;
        transition: all 0.2s ease;
        pointer-events: none;
        background-color: var(--color-muted);
        padding: 0 4px;
        color: var(--color-text);
    }

    .center {
        top: 50%;
        transform: translateY(-50%);
        font-size: 1rem;
        opacity: 0;
    }

    .above {
        top: -5px;
        font-size: 0.7rem;
        opacity: 1;
        border: 1px solid var(--color-accent);
        border-radius: 4px;
    }

    .options {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: inherit;
        margin-top: 1em;
        color: var(--color-text);
    }
</style>
