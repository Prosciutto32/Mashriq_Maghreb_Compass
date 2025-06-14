<footer>
    <div class="mission" >
        <p>
            Mashriq Maghrib Compass guides positive change across the MENA region. We empower governments, NGOs,
            and other stakeholders to drive innovation, build resilient communities, and achieve sustainable development through 
            strategic consulting, impactful research, and expert analysis.  
        </p>
    </div>
    <div class="social-icons" >
        <!-- Link da aggiornare con i relativi social appena ci sono -->
        <a href="/" aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>
        <a href="/" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
        <a href="/" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
    </div>
    <div class="copyright">
        <p>&copy; 2025 Mashriq Maghrib Compass. All rights reserved.</p>
    </div>
</footer>


<style>
footer {
    display: flex;
    flex-direction: column;
    background: var(--color-bg);
    margin: 2em 0 0;
    padding: 2em;
    text-align: center;
    color: var(--color-text);
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
}

.social-icons {
    display: flex;
    justify-content: center;
    gap: 1em;
    margin: 1em 0;
}

.social-icons a {
    width: 3em;
    height: 3em;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    background-color: var(--color-text);
    border-radius: 50%;
    transition: background-color 0.2s, transform 0.2s;
}

.social-icons a:hover {
    transform: scale(1.1); 
    background-color: var(--color-accent); 
}

.social-icons a i {
    color: var(--color-bg);
    font-size: 1.5em;
    opacity: 0.9;
}
</style>