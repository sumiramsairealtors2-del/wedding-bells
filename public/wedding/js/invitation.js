import { ScratchCard } from './scratch.mjs';
import { CeremonyCard } from './ceremony.mjs';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const opening = document.getElementById('opening');
const openButton = document.getElementById('open-invitation');
const main = document.getElementById('invitation');
const revealAll = document.getElementById('reveal-all');
const music = document.getElementById('wedding-music');
const musicToggle = document.getElementById('music-toggle');
const cards = [...document.querySelectorAll('.scratch-card')].map(card => card.dataset.event === 'haldi' ? new ScratchCard(card, .4) : new CeremonyCard(card));
function updateRevealAll() {
    const all = cards.every(card => card.revealed);
    revealAll.disabled = all; revealAll.querySelector('span:last-child').textContent = all ? 'All revealed' : 'Reveal All';
}
revealAll.hidden = false; updateRevealAll();
revealAll.addEventListener('click', () => { cards.forEach(card => card.reveal()); updateRevealAll(); });
document.addEventListener('ceremony-revealed', updateRevealAll);
function updateMusicToggle() {
    const playing = !music.paused;
    musicToggle.classList.toggle('is-playing', playing);
    musicToggle.setAttribute('aria-pressed', String(playing));
    musicToggle.setAttribute('aria-label', playing ? 'Pause wedding music' : 'Play wedding music');
    musicToggle.querySelector('.music-label').textContent = playing ? 'Music on' : 'Music';
}
async function startMusic() {
    try { await music.play(); } catch { /* Browsers may require the music button to be pressed. */ }
    updateMusicToggle();
}
musicToggle.addEventListener('click', async () => {
    if (music.paused) await startMusic(); else music.pause();
    updateMusicToggle();
});
music.addEventListener('play', updateMusicToggle); music.addEventListener('pause', updateMusicToggle);
let observer;
function observeSections() {
    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('in')); return;
    }
    observer = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); } });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
let openingStarted = false;
openButton.addEventListener('click', () => {
    if (openingStarted) return; openingStarted = true; opening.classList.add('opened');
    musicToggle.hidden = false; startMusic();
    setTimeout(() => {
        opening.hidden = true; document.body.classList.remove('invitation-locked');
        main.inert = false; document.querySelector('nav').inert = false;
        observeSections();
        main.tabIndex = -1; main.focus({ preventScroll: true });
    }, reducedMotion.matches ? 0 : 1700);
});
function setPetals() {
    const container = document.querySelector('.petals'); container.replaceChildren();
    if (reducedMotion.matches) return;
    for (let i = 0; i < 12; i++) {
        const petal = document.createElement('span'); petal.className = 'petal';
        petal.style.left = `${i * 37 % 100}%`; petal.style.animationDuration = `${14 + i % 5 * 3}s`; petal.style.animationDelay = `${i * 1.7}s`;
        container.append(petal);
    }
}
let frame = 0;
function updateParallax() {
    if (frame || reducedMotion.matches) return;
    frame = requestAnimationFrame(() => {
        frame = 0;
        if (scrollY < document.getElementById('home').offsetHeight) document.getElementById('hero-art').style.setProperty('--parallax', `${scrollY * .25}px`);
    });
}
window.addEventListener('scroll', updateParallax, { passive: true });
reducedMotion.addEventListener('change', () => {
    setPetals();
    if (reducedMotion.matches) { observer?.disconnect(); document.querySelectorAll('.reveal').forEach(el => el.classList.add('in')); }
});
setPetals();
document.documentElement.classList.add('js');
main.inert = true; document.querySelector('nav').inert = true;
document.body.classList.add('invitation-locked'); opening.hidden = false; openButton.focus({ preventScroll: true });
