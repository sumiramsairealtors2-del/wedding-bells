<?php
require __DIR__.'/../vendor/autoload.php';
use App\Support\Wedding;
function check(bool $value, string $name): void { if (!$value) throw new RuntimeException($name); echo "PASS: $name\n"; }
$events = Wedding::events();
check(count($events) === 6, 'six independent ceremonies');
check(count(array_unique(array_column($events, 'id'))) === 6, 'unique ceremony ids');
$expected = [
    ['Engagement & Tilak Ceremony','19 November 2026','9:15 AM'],
    ['Mayra Ceremony','19 November 2026','12:15 PM'],
    ['Sangeet Ceremony','19 November 2026','7:15 PM'],
    ['Haldi Ceremony','20 November 2026','8:30 AM'],
    ['Wedding Pheras','20 November 2026','3:15 PM'],
    ['Wedding Reception','20 November 2026','7:15 PM'],
];
foreach ($expected as $i => [$name,$date,$detail]) check([$events[$i]['name'],$events[$i]['date'],$events[$i]['detail']] === [$name,$date,$detail], $name.' schedule');
check(Wedding::REVEAL_THRESHOLD === 0.4, '40 percent threshold');
check(!Wedding::shouldReveal(0.399), 'below threshold remains covered');
check(Wedding::shouldReveal(0.4), 'at threshold reveals');

check(!in_array('mehndi', array_column($events,'id')), 'Mehndi removed');
check(Wedding::content()['groom'] === 'हर्षित' && Wedding::content()['bride'] === 'राजराजेश्वरी', 'Hindi couple names');
check(Wedding::content()['families'][0]['title'][1] === 'राजराजेश्वरी', 'bride family first');
