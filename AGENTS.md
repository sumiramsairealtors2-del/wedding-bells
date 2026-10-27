# Architecture
- Keep invitation content and ceremony identifiers in App\Support\Wedding so Blade and rule tests share one source.
- Use framework routing and escaped Blade values; load static CSS and ES modules directly without a bundler.
- Use ceremony-specific CSS cover transitions and genuine canvas scratching only for Haldi; fixed-resolution masks preserve scratches across resizing. Store only ephemeral reveal status in sessionStorage.
- Respect reduced motion and show ceremony details when JavaScript or artwork is unavailable.
- Render Sangeet fabric as registered SVG image rows with depth-delayed opening poses, so the hem moves before the header and fabric can billow without flat-panel sliding.
