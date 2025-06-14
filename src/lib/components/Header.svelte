<script>
    import { page } from '$app/state';
</script>
<header>
    <nav>
    <div class="nav-left">
        <a href="/">
            <img src="/logo.svg" alt="Mashriq Maghreb Compass logo" />
            <span class="logo-text">Mashriq <br> Maghreb <br> Compass</span>
        </a>
    </div>

    <div class="nav-right">
        <a href="/aboutMCC" aria-current={page.url.pathname === '/aboutMCC'}>About</a>
        <a href="/mission&vision" aria-current={page.url.pathname === '/mission&vision'}>Mission&Vision</a>
        <a href="/values" aria-current={page.url.pathname === '/values'}>Values</a>
        <a href="/contacts" aria-current={page.url.pathname === '/contacts'}>Contacts</a>
        <a href="/login" aria-current={page.url.pathname.startsWith('/login')}>Login</a>
    </div>
    </nav>
</header>

<style>
    header {
        top: 0;
        z-index: 10;
    }
        
    nav {
        background: var(--color-bg);
        z-index: 2;
        flex-wrap: wrap;
        border-bottom-left-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
        position: sticky;
        margin: 0 0 1.5em;
        padding: 1.2em 2em;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 12px rgba(0,0,0,0.12);
    }

    /* Mobile-first migliorie */
    @media (max-width: 768px) {
        nav {
            flex-direction: column;
            align-items: stretch;
            gap: 1em;
            padding: 1em; /* meno padding su dispositivi piccoli */
        }

        .nav-left,
        .nav-right {
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
            gap: 1em;
        }

        .nav-left {
            justify-content: center;
            text-align: center;
            flex-direction: column;
        }

        .nav-left a {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5em;
            text-decoration: none;
        }

        .nav-right {
            justify-content: center;
        }

        .nav-left img {
            height: 3em; /* più piccolo su mobile */
        }

        .logo-text {
            font-size: 0.9em;
            line-height: 1.2;
        }
    }


    .nav-left {
        display: flex;
        align-items: center;
        gap: 0.8em;
        padding: 0.6em 1em;
        border-radius: 0.75em;
        transition: box-shadow 0.3s ease, background 0.3s ease;
    }

    .nav-left img {
        height: 4em;
    }

    .logo-text {
        font-family: 'Playfair Display', serif; /* or another elegant font */
        font-size: 1em;
        font-weight: bold;
        line-height: 1.5;
        display: inline-block;
        white-space: pre-line; /* preserves line breaks */
        text-align: left;
    }

    .logo-text::after {
        content: "";
        display: block;
    }

    .nav-right {
        display: flex;
        gap: 1.5em;
    }

    nav a {
        text-decoration: none;
        color: var(--color-text);
        font-weight: 500;
        letter-spacing: 0.03em;
        padding: 0.5em 1em;
        border-radius: 6px;
        transition: background 0.2s, color 0.2s;
        display: inline-block;
    }

    nav a[aria-current=true] {
        background: var(--color-accent);
        color: var(--color-bg);
        box-shadow: 0 2px 8px rgba(132,140,137,0.08);
    }

    nav a:hover {
        background: var(--color-muted);
        color: var(--color-bg);
    }

    nav a:active {
        background: var(--color-accent);
        color: var(--color-bg);
    }

    /* Tab alignment for nav content */
    nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .nav-left, .nav-right {
        display: flex;
        align-items: center;
    }

    .nav-right {
        gap: 1.5em;
    }

    .nav-left {
        gap: 0.8em;
    }
</style>