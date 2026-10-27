# Harshit & Rajrajeshwari — Laravel wedding invitation

A standalone Laravel 12 / PHP 8.2+ application. The Lovable preview remains TanStack; this package runs separately on PHP hosting.

## Run locally

Install PHP 8.2+ with Laravel's standard extensions and Composer 2, then:

```sh
composer install
cp .env.example .env
php artisan key:generate
php artisan serve
```

Open http://localhost:8000. No database, Node build, authentication, or RSVP required. Google Fonts are loaded online; serif/cursive fallbacks work without network access. All invitation images are included locally.

## GitHub Pages

The standalone `index.html` is ready for GitHub Pages. Publish the repository root and keep the `public/wedding/` images and audio folders beside it; no PHP or build step is needed.

## Content

Edit `app/Support/Wedding.php` for names, family information, venue, ceremony schedule and ceremony identifiers. The venue name/address and Indore map link are **unconfirmed placeholders carried over from the existing invitation**, not verified wedding information; replace before sharing. All Blade text and attributes are escaped.

## Animations and interactions

- 1.6-second perspective opening doors, fading/expanding seal, softly breathing logo and shimmering opening label.
- Staggered scroll reveals, passive requestAnimationFrame hero parallax, drifting petals, smooth anchor navigation, button transitions and a guest-controlled original Bollywood-inspired romantic instrumental.
- Six independent ceremony interactions: Engagement rings split apart, Mayra's illustrated gift scene lifts away as a refined photo cover, Sangeet fabric curtains gather into individual pleats, Haldi scratches a marigold gold foil, Pheras unroll a sacred vow scroll and Reception dissolves its illustrated evening scene into the details.
- Smooth CSS transitions, stable square artwork surfaces, keyboard controls, per-card replay and Reveal All. Every page refresh starts with all ceremony cards unrevealed. Mobile scrolling is suppressed only while scratching the Haldi surface.
- Hindi couple names, a readable mobile invitation message background and bride-first family cards. Mehndi and the Radha Krishna section are removed.
- Reduced-motion mode disables decorative animation, parallax and delays. Without JavaScript the invitation and all details remain visible. Failed card images reveal details rather than trapping guests.

## Tests

```sh
composer test
node --test tests/scratch.test.mjs
```

## Deploy

Point your web server's document root at `public/` (never the package root). Run `composer install --no-dev --optimize-autoloader`, set `.env` with `APP_ENV=production`, `APP_DEBUG=false`, your HTTPS `APP_URL` and `SESSION_SECURE_COOKIE=true`, generate a unique application key, then `php artisan config:cache` and `php artisan view:cache`. Make `storage/` and `bootstrap/cache/` writable by the web-server user. Keep `.env` private. Apache rewrite rules are included; Nginx should use `try_files $uri $uri/ /index.php?$query_string`.

## Artwork

The uploaded र H logo is included unchanged. Ceremony sheets, lotus and Pichwai background are generated artwork from this invitation. Font licensing follows each font's Google Fonts distribution.
