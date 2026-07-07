<?php

use App\Jobs\ExpireBookingsJob;
use Illuminate\Support\Facades\Schedule;

Schedule::job(new ExpireBookingsJob)->everyFiveMinutes();
