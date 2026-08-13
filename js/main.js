/* ==========================================
   TALHA FAREEDI — PORTFOLIO JS (minimal)
   ========================================== */

// Theme toggle with saved preference
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

function applyTheme(dark) {
    document.body.classList.toggle('dark', dark);
    themeIcon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
}

applyTheme(localStorage.getItem('theme') === 'dark');
themeToggle.addEventListener('click', () => {
    applyTheme(!document.body.classList.contains('dark'));
});

// Mobile menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.querySelector('i').className = open ? 'fas fa-times' : 'fas fa-bars';
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.querySelector('i').className = 'fas fa-bars';
    });
});
