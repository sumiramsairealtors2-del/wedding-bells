<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{ $groom }} &amp; {{ $bride }} — Wedding Invitation</title>
<meta name="description" content="With the blessings of our families, join us 19–20 November 2026.">
<meta property="og:title" content="{{ $groom }} &amp; {{ $bride }} — Wedding Invitation">
<meta property="og:description" content="With the blessings of our families, join us 19–20 November 2026.">
<meta property="og:type" content="website"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{{ asset('wedding/images/wedding-logo.png') }}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Pinyon+Script&family=Tiro+Devanagari+Hindi&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{{ asset('wedding/css/invitation.css') }}">
<script type="module" src="{{ asset('wedding/js/invitation.js') }}"></script>
</head>
<body>
<div id="opening" class="opening" hidden>
    <div class="door door-left"></div><div class="door door-right"></div>
    <button id="open-invitation" class="opening-button" aria-label="Tap to open invitation">
        <span class="opening-frame ornate-frame">
            <img src="{{ asset('wedding/images/wedding-logo.png') }}" class="monogram breathe" alt="र H monogram" width="1024" height="1024">
            <span class="eyebrow">The Wedding Of</span>
            <span class="couple-opening hindi">{{ $groom }} <span class="gold">&amp;</span> {{ $bride }}</span>
            <span class="opening-label shimmer">Tap to Open Invitation</span>
        </span>
    </button>
</div>
<div class="petals" aria-hidden="true"></div>
<audio id="wedding-music" loop preload="auto" aria-label="Wedding invitation background music">
    <source src="{{ asset('wedding/audio/wedding-bollywood-theme.wav') }}?v=2" type="audio/wav">
</audio>
<button id="music-toggle" class="music-toggle" type="button" aria-pressed="false" aria-label="Play wedding music" hidden>
    <span class="music-icon" aria-hidden="true">♫</span><span class="music-label">Music</span>
</button>
<nav aria-label="Invitation sections"><ul>
@foreach(['home'=>'Home','family'=>'Family','functions'=>'Functions','venue'=>'Venue'] as $id=>$label)
<li><a href="#{{ $id }}">{{ $label }}</a></li>
@endforeach
</ul></nav>
<main id="invitation">
<section id="home" class="hero">
    <img id="hero-art" src="{{ asset('wedding/images/pichwai-bg.jpg') }}" alt="" width="1024" height="1536">
    <div class="hero-wash"></div>
    <div class="hero-content">
        <p class="hindi invocation reveal">॥ श्री गणेशाय नमः ॥</p>
        <div class="reveal delay-2"><img class="monogram breathe" src="{{ asset('wedding/images/wedding-logo.png') }}" alt="र H monogram" width="1024" height="1024"></div>
        <h1 class="hindi reveal delay-4">{{ $groom }}<span class="ampersand gold">&amp;</span>{{ $bride }}</h1>
        <div class="reveal delay-6"><div class="invitation-message"><span class="message-kicker">with love &amp; joy</span><p class="blessings">With the blessings of our families, we invite you to celebrate our wedding</p><div class="divider" aria-hidden="true">❁</div><p class="wedding-date">19–20 NOVEMBER 2026</p></div></div>
    </div>
</section>
<section id="family" class="section">
    <header class="section-title reveal"><p class="script gold">with blessings</p><h2 class="hindi">परिवार</h2><div class="divider" aria-hidden="true">❁</div></header>
    <div class="family-grid">
    @foreach($families as $family)
        @if($loop->index === 1)<img class="family-lotus" src="{{ asset('wedding/images/lotus.png') }}" alt="" width="816" height="816" loading="lazy">@endif
        <div class="family-block ornate-frame reveal"><p class="hindi muted">{{ $family['title'][0] }}</p><h3 class="hindi">{{ $family['title'][1] }}</h3><div class="gold-rule"></div><dl>
        @foreach($family['lines'] as [$label,$value])<div><dt class="hindi gold">{{ $label }}</dt><dd class="hindi">{{ $value }}</dd></div>@endforeach
        </dl></div>
    @endforeach
    </div>
</section>
<section id="functions" class="section functions" data-threshold="{{ $threshold }}">
    <header class="section-title reveal"><p class="script gold">six moments, one celebration</p><h2>Wedding Functions</h2><div class="divider" aria-hidden="true">❁</div></header>
    <div class="function-actions"><button class="button" id="reveal-all" hidden><span aria-hidden="true">✧</span> <span>Reveal All</span></button></div>
    <div class="ceremony-grid">
    @foreach($events as $event)
    <article class="scratch-card reveal" data-event="{{ $event['id'] }}" data-artwork="{{ asset('wedding/images/'.$event['artwork']) }}" data-revealed="false">
        <div class="scratch-area">
            <div class="event-details"><p class="event-day gold">{{ $event['day'] }}</p><span class="event-flower gold" aria-hidden="true">❁</span><h3>{{ $event['name'] }}</h3><div class="gold-rule"></div><p class="event-date">{{ $event['date'] }}</p><p class="event-time muted">{{ $event['detail'] }}</p></div>
            @if($event['id'] === 'haldi')
             <canvas class="scratch-canvas" aria-hidden="true" hidden></canvas><span class="scratch-hint" hidden aria-hidden="true">Scratch the marigold foil</span>
            @else
             <div class="ceremony-cover" data-curtains="{{ asset('wedding/images/ceremony-curtains.jpg') }}" hidden aria-hidden="true"></div>
            <button class="ceremony-open" aria-label="Reveal {{ $event['name'] }}" title="Reveal {{ $event['name'] }}" hidden><span aria-hidden="true">{{ ['engagement'=>'♢','mayra'=>'❁','sangeet'=>'♫','haldi'=>'✿','pheras'=>'❋','reception'=>'✧'][$event['id']] }}</span></button>
            @endif
        </div>
        <div class="event-footer"><p>{{ $event['name'] }}</p><button class="reveal-event icon-button" aria-label="Reveal {{ $event['name'] }}" title="Reveal ceremony details" hidden><span aria-hidden="true">✧</span></button></div>
        <span class="sr-only event-status" role="status"></span>
    </article>
    @endforeach
    </div>
</section>
<section id="venue" class="section">
    <header class="section-title reveal"><p class="script gold">where</p><h2>Venue</h2><div class="divider" aria-hidden="true">❁</div></header>
    <div class="venue-block ornate-frame reveal"><img src="{{ asset('wedding/images/lotus.png') }}" alt="" width="816" height="816" loading="lazy"><h3>{{ $venue['name'] }}</h3><p class="muted">{{ $venue['address'] }}</p><a class="maps-button" href="{{ $venue['mapsUrl'] }}" target="_blank" rel="noreferrer">Open in Maps</a></div>
</section>

<footer class="reveal"><img class="monogram" src="{{ asset('wedding/images/wedding-logo.png') }}" alt="" width="1024" height="1024" loading="lazy"><p class="hindi">राधे राधे</p><p class="footer-blessing">As Radha and Krishna are bound by eternal love, we seek your blessings as we begin our journey together.</p><div class="divider" aria-hidden="true">❁</div><p class="script gold">with love, the Jangid families</p></footer>
</main>
</body>
</html>
