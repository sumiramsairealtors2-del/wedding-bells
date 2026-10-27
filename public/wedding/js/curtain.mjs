const ROWS = 160;
const smooth = value => { const t = Math.max(0, Math.min(1, value)); return t*t*(3-2*t); };
export function mountCurtain(cover) {
 const NS = 'http://www.w3.org/2000/svg';
 const make = (tag, attributes) => { const node = document.createElementNS(NS, tag); for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value); return node; };
 const svg = make('svg', {viewBox:'0 0 1000 1000', preserveAspectRatio:'none', class:'curtain-fabric', 'aria-hidden':'true'});
 const rows = [];
 for (const side of [-1, 1]) for (let row = 0; row < ROWS; row++) {
  const group = make('g',{class:'curtain-row'}), x = side < 0 ? 0 : 499, y = row * 1000 / ROWS, h = 1000 / ROWS + 2;
  const strip = make('svg',{x,y,width:501,height:h,viewBox:`${x} ${y} 501 ${h}`,preserveAspectRatio:'none',overflow:'hidden'});
  strip.append(make('image',{href:cover.dataset.curtains,width:1000,height:1000,preserveAspectRatio:'none'})); group.append(strip); svg.append(group); rows.push({group,side,row});
 }
 cover.replaceChildren(svg);
 const media = matchMedia('(prefers-reduced-motion: reduce)');
  let opened = false, changed = false, started = performance.now();
 const draw = now => {
  const elapsed = media.matches || !changed ? (opened ? 3400 : 2000) : now - started;
  for (const {group,side,row} of rows) {
   const depth = row / (ROWS-1), delay = (1-depth)*1100;
    const progress = opened ? smooth((elapsed-delay)/2300) : 1-smooth(elapsed/2000);
   const breeze = Math.sin(now/850+depth*2.8+side*.55)*.022*depth*depth + Math.sin(depth*8-now/670)*.006*depth;
   const width = 1-progress*.94+(media.matches ? 0 : breeze)*(1-progress*.75), anchor = side < 0 ? 0 : 1000;
   group.setAttribute('transform',`translate(${anchor+side*progress*10} 0) scale(${width} 1) translate(${-anchor} 0)`);
  }
  if (!media.matches) requestAnimationFrame(draw);
 };
 draw(started);
 media.addEventListener('change', () => draw(performance.now()));
  return value => { opened = value; changed = true; started = performance.now(); if(media.matches) draw(started); };
}
