import { mountCurtain } from './curtain.mjs';

const make = (tag, className) => {
 const node = document.createElement(tag); node.className = className; return node;
};
const setPrompt = (button, text) => { button.innerHTML = `<span class="ceremony-control-label">${text}</span>`; };
const mountEditorialCopy = (cover, kickerText, titleText, subtitleText) => {
 const copy = make('div', 'cover-editorial');
 const kicker = make('span', 'cover-kicker'); kicker.textContent = kickerText;
 const title = make('strong', 'cover-title'); title.textContent = titleText;
 const rule = make('span', 'cover-rule'); rule.textContent = '✦';
 const subtitle = make('span', 'cover-subtitle'); subtitle.textContent = subtitleText;
 copy.append(kicker, title, rule, subtitle); cover.append(copy);
};

function mountRingCover(cover) {
 cover.classList.add('cover-ring'); cover.replaceChildren();
 const stars = make('div', 'ring-stars');
 for (let i = 0; i < 18; i++) { const star = make('span', 'ring-star'); star.style.left = `${i * 53 % 100}%`; star.style.top = `${i * 37 % 100}%`; star.style.animationDelay = `${i * .1}s`; stars.append(star); }
 const art = make('div', 'ring-art'); art.append(make('span', 'ring-left'), make('span', 'ring-right'), make('span', 'ring-diamond'));
 cover.append(stars, art);
 mountEditorialCopy(cover, 'A PROMISE • A BEGINNING', 'Engagement', 'where forever begins');
}

function mountFlowerCover(cover) {
 cover.classList.add('cover-mayra'); cover.replaceChildren();
 mountEditorialCopy(cover, 'FAMILY • FLOWERS • BLESSINGS', 'Mayra', 'an afternoon of love and celebration');
}

function mountDiscoCover(cover) {
 cover.classList.add('cover-reception'); cover.replaceChildren();
 mountEditorialCopy(cover, 'DINNER • MUSIC • CELEBRATION', 'Reception', 'an evening beneath the lights');
}

function mountScrollCover(cover) {
 cover.classList.add('cover-scroll'); cover.replaceChildren();
 const sheet = make('div', 'scroll-sheet');
 const topRoll = make('span', 'scroll-roll scroll-roll-top'); const bottomRoll = make('span', 'scroll-roll scroll-roll-bottom');
 const seal = make('span', 'scroll-seal'); seal.textContent = '❋';
 const glyph = make('span', 'scroll-glyph'); glyph.textContent = 'ॐ';
 const lines = make('div', 'scroll-lines'); lines.append(make('span', ''), make('span', ''), make('span', ''));
 sheet.append(topRoll, bottomRoll, glyph, lines, seal); cover.append(sheet);
 mountEditorialCopy(cover, 'SACRED VOWS • ETERNAL LOVE', 'Wedding Pheras', 'under the sacred fire');
}

export class CeremonyCard {
 constructor(card) {
   this.card = card; this.revealed = false;
  this.details = card.querySelector('.event-details');
   this.cover = card.querySelector('.ceremony-cover'); this.cover.hidden = false;
   this.cover.style.setProperty('--event-artwork', `url(${JSON.stringify(card.dataset.artwork)})`);
  this.button = card.querySelector('.ceremony-open'); this.button.hidden = false;
  this.footer = card.querySelector('.reveal-event'); this.footer.hidden = false;
   const event = card.dataset.event;
    if (event === 'engagement') { mountRingCover(this.cover); setPrompt(this.button, 'Discover the promise'); }
    else if (event === 'mayra') { mountFlowerCover(this.cover); setPrompt(this.button, 'Open the Mayra ceremony'); }
    else if (event === 'sangeet') { this.cover.classList.add('cover-curtain'); this.moveCurtain = mountCurtain(this.cover); mountEditorialCopy(this.cover, 'MUSIC • MOVEMENT • JOY', 'Sangeet', 'an evening of rhythm and celebration'); setPrompt(this.button, 'Enter the music'); }
    else if (event === 'pheras') { mountScrollCover(this.cover); setPrompt(this.button, 'Open the vows'); }
    else if (event === 'reception') { mountDiscoCover(this.cover); setPrompt(this.button, 'Enter the reception'); }
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
