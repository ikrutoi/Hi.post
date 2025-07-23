<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ImageTemplate;

class SystemImageSeeder extends Seeder
{
    public function run(): void
    {
        ImageTemplate::create([
            'title' => 'Image_holiday_01',
            'image_path' => '/images/system/architect_01.jpg',
            'mime_type' => 'image/jpeg',
            'size' => 124000,
            'type' => 'system',
        ]);

        ImageTemplate::create([
            'title' => 'Image_new_year_01',
            'image_path' => '/images/system/car_01.jpg',
            'mime_type' => 'image/jpeg',
            'size' => 98000,
            'type' => 'system',
        ]);
    }
}

