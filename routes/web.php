<?php
use App\Support\Wedding;
use Illuminate\Support\Facades\Route;
Route::get('/', fn () => view('invitation', Wedding::content()))->name('invitation');
