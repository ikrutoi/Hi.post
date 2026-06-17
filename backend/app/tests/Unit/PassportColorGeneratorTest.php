<?php

namespace Tests\Unit;

use App\Services\PassportColorGenerator;
use PHPUnit\Framework\TestCase;

class PassportColorGeneratorTest extends TestCase
{
    public function test_generates_nineteen_hex_colors_deterministically(): void
    {
        $generator = new PassportColorGenerator();

        $first = $generator->generate('42');
        $second = $generator->generate('42');

        $this->assertSame($first, $second);
        $this->assertCount(19, $first);

        foreach (PassportColorGenerator::ELEMENT_IDS as $id) {
            $this->assertMatchesRegularExpression('/^#[0-9a-f]{6}$/', $first[$id]);
        }
    }

    public function test_different_user_ids_produce_different_passports(): void
    {
        $generator = new PassportColorGenerator();

        $this->assertNotSame(
            $generator->generate('1'),
            $generator->generate('2'),
        );
    }

    public function test_matches_frontend_reference_for_user_42(): void
    {
        $generator = new PassportColorGenerator();
        $colors = $generator->generate('42');

        $this->assertSame('#d8815e', $colors['1']);
        $this->assertSame('#31dfdf', $colors['10']);
        $this->assertSame('#cc3541', $colors['19']);
    }
}
