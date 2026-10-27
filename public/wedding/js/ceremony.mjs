import { mountCurtain } from './curtain.mjs';

const make = (tag, className) => {
 const node = document.createElement(tag); node.className = className; return node;
};
const setPrompt = (button, text) => { button.innerHTML = `<span class="ceremony-control-label">${text}</span>`; };

function mountRingCover(cover) {
 cover.classList.add('cover-ring'); cover.replaceChildren();
 const stars = make('div', 'ring-stars');
 for (let i = 0; i < 18; i++) { const star = make('span', 'ring-star'); star.style.left = `${i * 53 % 100}%`; star.style.top = `${i * 37 % 100}%`; star.style.animationDelay = `${i * .1}s`; stars.append(star); }
 const art = make('div', 'ring-art'); art.append(make('span', 'ring-left'), make('span', 'ring-right'), make('span', 'ring-diamond'));
 cover.append(stars, art);
}

function mountFlowerCover(cover) {
 cover.classList.add('cover-petals'); cover.replaceChildren();
 const petals = make('div', 'petal-field');
 for (let i = 0; i < 14; i++) {
  const petal = make('span', 'ceremony-petal');
  const angle = i / 14 * Math.PI * 2;
  petal.textContent = '✿'; petal.style.left = `${8 + i * 37 % 84}%`; petal.style.top = `${8 + i * 53 % 84}%`;
  petal.style.setProperty('--dx', `${Math.cos(angle) * (70 + i % 4 * 24)}px`);
  petal.style.setProperty('--dy', `${80 + i % 3 * 28}px`); petal.style.setProperty('--spin', `${i * 47 + 180}deg`); petal.style.animationDelay = `${i * .08}s`; petals.append(petal);
 }
 const prompt = make('p', 'cover-prompt'); prompt.textContent = 'Follow the flowers'; petals.append(prompt); cover.append(petals);
}

function mountDiscoCover(cover) {
 cover.classList.add('cover-disco'); cover.replaceChildren();
 const beams = make('div', 'disco-beams');
 for (let i = 0; i < 12; i++) { const beam = make('span', 'disco-beam'); beam.style.rotate = `${i * 30}deg`; beam.style.animationDelay = `${i * .05}s`; beams.append(beam); }
 const art = make('div', 'disco-art'); const ball = make('div', 'disco-ball');
 for (let i = 0; i < 12; i++) { const tile = make('span', 'disco-tile'); tile.style.rotate = `${i * 30}deg`; ball.append(tile); }
 art.append(ball);
 const particles = make('div', 'disco-particles');
 for (let i = 0; i < 20; i++) { const particle = make('span', 'disco-particle'); const angle = i / 20 * Math.PI * 2; particle.style.setProperty('--dx', `${Math.cos(angle) * (100 + i % 5 * 30)}px`); particle.style.setProperty('--dy', `${Math.sin(angle) * (100 + i % 5 * 30)}px`); particle.style.setProperty('--particle-color', i % 3 === 0 ? '#ffd700' : i % 3 === 1 ? '#ff69b4' : '#00ffff'); particles.append(particle); }
 cover.append(beams, art, particles);
}

function mountScrollCover(cover) {
 cover.classList.add('cover-scroll'); cover.replaceChildren();
 const sheet = make('div', 'scroll-sheet');
 const topRoll = make('span', 'scroll-roll scroll-roll-top'); const bottomRoll = make('span', 'scroll-roll scroll-roll-bottom');
 const seal = make('span', 'scroll-seal'); seal.textContent = '❋';
 const glyph = make('span', 'scroll-glyph'); glyph.textContent = 'ॐ';
 const lines = make('div', 'scroll-lines'); lines.append(make('span', ''), make('span', ''), make('span', ''));
 sheet.append(topRoll, bottomRoll, glyph, lines, seal); cover.append(sheet);
}

export class CeremonyCard {
 constructor(card) {
   this.card = card; this.revealed = false;
  this.details = card.querySelector('.event-details');
  this.cover = card.querySelector('.ceremony-cover'); this.cover.hidden = false;
  this.button = card.querySelector('.ceremony-open'); this.button.hidden = false;
  this.footer = card.querySelector('.reveal-event'); this.footer.hidden = false;
   const event = card.dataset.event;
   if (event === 'engagement') { mountRingCover(this.cover); setPrompt(this.button, 'Tap the rings'); }
   else if (event === 'mayra') { mountFlowerCover(this.cover); setPrompt(this.button, 'Tap the flowers'); }
   else if (event === 'sangeet') { this.cover.classList.add('cover-curtain'); this.moveCurtain = mountCurtain(this.cover); setPrompt(this.button, 'Open the curtains'); }
   else if (event === 'pheras') { mountScrollCover(this.cover); setPrompt(this.button, 'Unroll the vows'); }
   else if (event === 'reception') { mountDiscoCover(this.cover); setPrompt(this.button, 'Click the celebration'); }
  this.details.setAttribute('aria-hidden', 'true');
   this.button.addEventListener('click', () => this.reveal());
  this.footer.addEventListener('click', () => this.revealed ? this.replay() : this.reveal());
   const image = new Image(); image.onerror = () => this.reveal(); image.src = card.dataset.artwork;
 }
 replay() {
  this.moveCurtain?.(false);
  this.revealed = false; this.card.dataset.revealed = 'false';
  this.details.setAttribute('aria-hidden', 'true');
  setTimeout(() => this.reveal(), matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 2200);
 }
 reveal() {
  if (this.revealed) return; this.revealed = true; this.card.dataset.revealed = 'true';
  this.moveCurtain?.(true);
  this.details.setAttribute('aria-hidden', 'false'); this.button.hidden = true;
  this.footer.disabled = false; this.footer.title = 'Replay animation'; this.footer.setAttribute('aria-label', `Replay ${this.card.querySelector('.event-footer p').textContent}`);
  this.footer.innerHTML = '<span aria-hidden="true">↻</span>';
  this.card.querySelector('.event-status').textContent = this.footer.getAttribute('aria-label');
   document.dispatchEvent(new Event('ceremony-revealed'));
 }
}
