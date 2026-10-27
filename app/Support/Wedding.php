<?php
namespace App\Support;
final class Wedding
{
    public const REVEAL_THRESHOLD = 0.4;
    public static function shouldReveal(float $fraction): bool { return $fraction >= self::REVEAL_THRESHOLD; }
    public static function events(): array
    {
        return [
            ['id'=>'engagement','name'=>'Engagement & Tilak Ceremony','day'=>'Thursday','date'=>'19 November 2026','detail'=>'9:15 AM','artwork'=>'ceremonies-a.jpg','quadrant'=>1],
            ['id'=>'mayra','name'=>'Mayra Ceremony','day'=>'Thursday','date'=>'19 November 2026','detail'=>'12:15 PM','artwork'=>'ceremonies-a.jpg','quadrant'=>2],
            ['id'=>'sangeet','name'=>'Sangeet Ceremony','day'=>'Thursday','date'=>'19 November 2026','detail'=>'7:15 PM','artwork'=>'ceremonies-a.jpg','quadrant'=>3],
            ['id'=>'haldi','name'=>'Haldi Ceremony','day'=>'Friday','date'=>'20 November 2026','detail'=>'8:30 AM','artwork'=>'ceremonies-b.jpg','quadrant'=>0],
            ['id'=>'pheras','name'=>'Wedding Pheras','day'=>'Friday','date'=>'20 November 2026','detail'=>'3:15 PM','artwork'=>'ceremonies-b.jpg','quadrant'=>1],
            ['id'=>'reception','name'=>'Wedding Reception','day'=>'Friday','date'=>'20 November 2026','detail'=>'7:15 PM','artwork'=>'ceremonies-b.jpg','quadrant'=>2],
        ];
    }
    public static function content(): array
    {
        return [
            'groom'=>'हर्षित', 'bride'=>'राजराजेश्वरी',
            'venue'=>['name'=>'Venue to be announced','address'=>'Venue address, Indore, Madhya Pradesh','mapsUrl'=>'https://maps.google.com/?q=Indore'],
            'families'=>[
                ['title'=>['आयुष्मति','राजराजेश्वरी'],'lines'=>[
                    ['सुपौत्री','श्रीमती भगवती देवी - श्री शिवकरण जी जांगिड'],
                    ['सुपुत्री','श्रीमती सुमन देवी - श्री अशोक कुमार जांगिड , इंदौर'],
                ]],
                ['title'=>['आयुष्मान','हर्षित'],'lines'=>[
                    ['सुपौत्र','स्व. श्रीमती प्रभा देवी - श्री नारायणदासजी राठी'],
                    ['सुपुत्र','श्रीमती जया देवी - स्व. श्री जितेंद्रजी राठी , बरेली( म.प्र.)'],
                ]],
            ],
            'events'=>self::events(), 'threshold'=>self::REVEAL_THRESHOLD,
        ];
    }
}
