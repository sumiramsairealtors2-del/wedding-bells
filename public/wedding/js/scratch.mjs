export function erasedFraction(pixels) {
    let removed = 0, sampled = 0;
    for (let i = 3; i < pixels.length; i += 64) { removed += 1 - pixels[i] / 255; sampled++; }
    return sampled ? removed / sampled : 0;
}
export function shouldReveal(fraction, threshold = 0.4) { return fraction >= threshold; }
export class ScratchCard {
    constructor(card, threshold) {
        this.card = card; this.threshold = threshold; this.canvas = card.querySelector('canvas');
        this.button = card.querySelector('.reveal-event'); this.hint = card.querySelector('.scratch-hint');
        this.revealed = false; this.ready = false; this.pointer = null; this.previous = null;
        this.frame = 0; this.lastCheck = 0;
        this.surface = document.createElement('canvas'); this.surface.width = this.surface.height = 768;
        this.context = this.surface.getContext('2d', { willReadFrequently: true });
        this.display = this.canvas.getContext('2d');
        this.button.hidden = false;
        this.button.addEventListener('click', () => this.revealed ? this.reset() : this.reveal());
        if (!this.context || !this.display) { this.reveal(); return; }
        this.canvas.hidden = false;
        const image = new Image();
        image.onload = () => {
            if (this.revealed) return;
             this.paintFoil();
            this.ready = true; this.hint.hidden = false; this.resize();
        };
        image.onerror = () => this.reveal(); image.src = card.dataset.artwork;
        this.observer = new ResizeObserver(() => this.resize()); this.observer.observe(this.canvas);
        this.canvas.addEventListener('pointerdown', e => this.start(e));
        this.canvas.addEventListener('pointermove', e => {
            if (this.pointer !== e.pointerId) return;
            for (const sample of (e.getCoalescedEvents?.() || []).length ? e.getCoalescedEvents() : [e]) this.scratch(sample);
        });
        for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) this.canvas.addEventListener(type, () => this.end());
    }
    paintFoil() {
        const context = this.context;
        context.clearRect(0, 0, 768, 768);
        const foil = context.createLinearGradient(0, 0, 768, 768);
        foil.addColorStop(0, '#fffdf7'); foil.addColorStop(.5, '#f8edc9'); foil.addColorStop(1, '#ead39a');
        context.fillStyle = foil; context.fillRect(0, 0, 768, 768);
        context.strokeStyle = 'rgba(177, 132, 35, .65)'; context.lineWidth = 5; context.strokeRect(22, 22, 724, 724);
        context.strokeStyle = 'rgba(177, 132, 35, .25)'; context.lineWidth = 1;
        context.setLineDash([5, 12]); context.strokeRect(38, 38, 692, 692); context.setLineDash([]);
        context.globalAlpha = .35;
        for (let i = 0; i < 110; i++) {
            const x = (i * 149) % 720 + 24, y = (i * 83) % 720 + 24;
            context.fillStyle = i % 2 ? '#fffdf7' : '#b18423'; context.beginPath(); context.arc(x, y, 1 + i % 3, 0, Math.PI * 2); context.fill();
        }
        context.globalAlpha = 1;
        const center = 384;
        context.strokeStyle = 'rgba(177, 132, 35, .72)'; context.lineWidth = 3;
        for (const radius of [76, 94, 112]) { context.beginPath(); context.arc(center, center, radius, 0, Math.PI * 2); context.stroke(); }
        for (let i = 0; i < 12; i++) {
            const angle = i / 12 * Math.PI * 2;
            context.save(); context.translate(center, center); context.rotate(angle);
            context.fillStyle = 'rgba(218, 165, 32, .72)'; context.beginPath(); context.moveTo(0, -82); context.lineTo(10, -106); context.lineTo(0, -128); context.lineTo(-10, -106); context.closePath(); context.fill();
            context.restore();
        }
        context.fillStyle = 'rgba(177, 132, 35, .88)'; context.beginPath(); context.arc(center, center, 52, 0, Math.PI * 2); context.fill();
        context.fillStyle = '#fffdf7'; context.font = '600 38px "Tiro Devanagari Hindi", serif'; context.textAlign = 'center'; context.fillText('हल्दी', center, center + 14);
        context.textAlign = 'start';
    }
    resize() {
        if (this.revealed) return;
        const size = this.canvas.getBoundingClientRect().width;
        const pixels = Math.round(size * Math.min(devicePixelRatio || 1, 3));
        if (pixels <= 0) return;
        this.canvas.width = this.canvas.height = pixels; this.paint();
    }
    paint() {
        if (!this.display || this.revealed) return;
        this.display.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.display.drawImage(this.surface, 0, 0, this.canvas.width, this.canvas.height);
    }
    schedulePaint() {
        if (this.frame) return;
        this.frame = requestAnimationFrame(() => {
            this.frame = 0; this.paint();
            if (performance.now() - this.lastCheck > 160) { this.lastCheck = performance.now(); this.check(); }
        });
    }
    start(e) {
        if (!this.ready || this.revealed || this.pointer !== null || (e.pointerType === 'mouse' && e.button !== 0)) return;
        e.preventDefault(); this.pointer = e.pointerId; this.previous = null;
        this.canvas.setPointerCapture(e.pointerId); this.card.classList.add('scratching'); this.scratch(e);
    }
    scratch(e) {
        if (!this.context || this.revealed) return;
        const rect = this.canvas.getBoundingClientRect();
        const point = { x: (e.clientX - rect.left) / rect.width * 768, y: (e.clientY - rect.top) / rect.height * 768 };
        const previous = this.previous || point;
        const steps = Math.max(1, Math.ceil(Math.hypot(point.x - previous.x, point.y - previous.y) / 8));
        this.context.globalCompositeOperation = 'destination-out';
        for (let i = 0; i <= steps; i++) {
            const x = previous.x + (point.x - previous.x) * i / steps, y = previous.y + (point.y - previous.y) * i / steps;
            const brush = this.context.createRadialGradient(x, y, 32, x, y, 52);
            brush.addColorStop(0, 'rgba(0,0,0,1)'); brush.addColorStop(1, 'rgba(0,0,0,0)');
            this.context.fillStyle = brush; this.context.fillRect(x - 52, y - 52, 104, 104);
        }
        this.context.globalCompositeOperation = 'source-over'; this.previous = point; this.schedulePaint();
    }
    check() {
        if (!this.context || !this.ready || this.revealed) return;
        if (shouldReveal(erasedFraction(this.context.getImageData(0, 0, 768, 768).data), this.threshold)) this.reveal();
    }
    end() {
        const pointer = this.pointer; this.pointer = null; this.previous = null;
        this.card.classList.remove('scratching');
        if (pointer !== null && this.canvas.hasPointerCapture(pointer)) this.canvas.releasePointerCapture(pointer);
        this.check();
    }
    reset() {
        this.revealed = false; this.ready = false; this.card.dataset.revealed = 'false';
        this.canvas.hidden = false;
        const image = new Image();
        image.onload = () => {
             this.paintFoil();
            this.ready = true; this.hint.hidden = false; this.resize(); this.observer?.observe(this.canvas);
        };
        image.onerror = () => this.reveal(); image.src = this.card.dataset.artwork;
        this.button.setAttribute('aria-label', `Reveal ${this.card.querySelector('.event-footer p').textContent}`);
        this.button.querySelector('span').textContent = '✧';
        this.card.dispatchEvent(new CustomEvent('ceremony-revealed', { bubbles: true }));
    }
    reveal() {
        if (this.revealed) return;
        this.revealed = true; this.card.dataset.revealed = 'true'; this.card.classList.remove('scratching');
        const pointer = this.pointer; this.pointer = null; this.previous = null;
        if (pointer !== null && this.canvas.hasPointerCapture(pointer)) this.canvas.releasePointerCapture(pointer);
        if (this.frame) cancelAnimationFrame(this.frame); this.frame = 0; this.observer?.disconnect();
        this.button.disabled = false; this.button.querySelector('span').textContent = '↻';
        const name = this.card.querySelector('.event-footer p').textContent;
        this.button.setAttribute('aria-label', `Replay ${name}`); this.button.title = 'Scratch again';
        this.card.querySelector('.event-status').textContent = `${name} revealed`;
        this.card.dispatchEvent(new CustomEvent('ceremony-revealed', { bubbles: true }));
    }
}
