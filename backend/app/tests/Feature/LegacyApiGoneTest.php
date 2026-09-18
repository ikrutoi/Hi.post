<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class LegacyApiGoneTest extends TestCase
{
    use RefreshDatabase;

    public function test_legacy_postcard_and_template_routes_are_gone(): void
    {
        $this->getJson('/api/postcards')->assertStatus(410);
        $this->postJson('/api/postcards', [])->assertStatus(410);

        $this->getJson('/api/templates/images')->assertStatus(410);
        $this->postJson('/api/templates/images', [])->assertStatus(410);

        $this->getJson('/api/templates/texts')->assertStatus(410);
        $this->postJson('/api/templates/texts', [])->assertStatus(410);

        $this->getJson('/api/templates/recipients')->assertStatus(410);
        $this->postJson('/api/templates/recipients', [])->assertStatus(410);

        $this->getJson('/api/templates/senders')->assertStatus(410);
        $this->postJson('/api/templates/senders', [])->assertStatus(410);
    }

    public function test_system_image_catalog_stays(): void
    {
        $this->getJson('/api/templates/images/system')->assertOk();
    }

    public function test_legacy_template_tables_are_dropped(): void
    {
        $this->assertFalse(Schema::hasTable('postcards'));
        $this->assertFalse(Schema::hasTable('sender_templates'));
        $this->assertFalse(Schema::hasTable('recipient_templates'));
        $this->assertFalse(Schema::hasTable('text_templates'));
        $this->assertTrue(Schema::hasTable('image_templates'));
        $this->assertTrue(Schema::hasTable('user_postcards'));
        $this->assertFalse(Schema::hasTable('user_postcard_snapshots'));
    }
}
