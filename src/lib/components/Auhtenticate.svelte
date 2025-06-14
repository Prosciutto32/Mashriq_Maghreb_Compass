<script>
    import { goto } from "$app/navigation";
    import { authHandler } from "../store/server.store";
    let email = $state('');
    let password = $state('');
    let confirmPassword = $state('');
    let error = $state(false);
    let register = $state(false);
    let authanticating = $state(false);
    let errormsg = $state('');

    async function handleAuthenticate() {
        if (authanticating) return;
        if (!email || !password || (register && !confirmPassword)) {
            errormsg = "Please fill all fields";
            error = true;
            authanticating = false;
            return;
        }

        authanticating = true;
        error = false;
        console.log("Logging in with:", email);
        try{
            if (!register){
                await authHandler.login(email, password);
                goto("/login/home");
                console.log("Login successful");
            }else{
                if (password !== confirmPassword) {
                    errormsg = "Passwords do not match";
                    error = true;
                    authanticating = false;
                    return;
                }
                await authHandler.signup(email, password);
            }
            authanticating = false;
        }catch(e){
            if (e && typeof e === 'object' && 'code' in e && 'message' in e) {
                switch (e.code) {
                    case "auth/email-already-in-use":
                        errormsg = "Email already in use";
                        break;
                    case "auth/invalid-email":
                        errormsg = "Invalid email";
                        break;
                    case "auth/user-not-found":
                        errormsg = "User not found";
                        break;
                    case "auth/wrong-password":
                        errormsg = "Wrong password";
                        break;
                    default:
                        errormsg = String(e.message);
                        break;
                }
            } 
            error = true;
            authanticating = false;
        }

        
    }
</script>

<div class="authContainer">
    <form onsubmit={handleAuthenticate}>
        <h1>{register?"Register":"Login"}</h1>
        {#if error}
            <p class="error">{errormsg}</p>
        {/if}

        <label>
            <p class={email ? "above" : "center"}>Email</p>
            <input type="email" placeholder="email" required bind:value={email} />
        </label>

        <label>
            <p class={password ? "above" : "center"}>Password</p>
            <input type="password" placeholder="Password" required bind:value={password} />
        </label>
        {#if register}
            <label>
                <p class={confirmPassword ? "above" : "center"}>Confirm Password</p>
                <input type="password" placeholder="Confirm Password" required bind:value={confirmPassword} />
            </label>
        {/if}

        <button type="submit" disabled={authanticating}>
            {#if authanticating}
                {register ? "Registering..." : "Logging in..."}
            {:else}
                {register ? "Register" : "Login"}
            {/if}
        </button>
        <div class="options">
            {#if !register}
                <button type="button" onclick={() => goto("/login/forgot")}>
                    Forgot Password?
                </button>
            {/if}
            <p>Or</p>
            <button type="button" onclick={() => 
            {error = false;
            register = !register;}}>
                {register ? "Login" : "Register"}
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

    .error {
        color: var(--color-error);
        font-size: 0.9rem;
        text-align: center;

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
