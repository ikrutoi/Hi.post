<?php

namespace App\Services;

use App\Models\User;

class PassportColorGenerator
{
    /** @var list<string> */
    public const ELEMENT_IDS = [
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
        '11', '12', '13', '14', '15', '16', '17', '18', '19',
    ];

    private const SECTOR_COUNT = 19;

    private const SATURATION_MIN = 58;

    private const SATURATION_MAX = 82;

    private const LIGHTNESS_MIN = 48;

    private const LIGHTNESS_MAX = 62;

    /**
     * @return array<string, string>
     */
    public function generate(string $userId): array
    {
        $colors = [];

        foreach (self::ELEMENT_IDS as $sectorIndex => $id) {
            $random = $this->createSeededRandom("{$userId}:{$id}");
            $colors[$id] = $this->pickColorInSector($sectorIndex, $random);
        }

        return $colors;
    }

    public function ensureForUser(User $user): User
    {
        $userId = (string) $user->id;
        $needsSave = false;

        if (! $this->isComplete($user->passport_colors)) {
            $user->passport_colors = $this->generate($userId);
            $needsSave = true;
        }

        if (! $this->isValidCode($user->passport_code)) {
            $user->passport_code = $this->generateCode($userId);
            $needsSave = true;
        }

        if (! $needsSave) {
            return $user;
        }

        $user->save();

        return $user->fresh() ?? $user;
    }

    public function generateCode(string $userId): string
    {
        $random = $this->createSeededRandom("{$userId}:passport-code");
        $chars = '';
        $alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $alphabetLength = strlen($alphabet);

        for ($i = 0; $i < 16; $i++) {
            $chars .= $alphabet[(int) floor($random() * $alphabetLength)];
        }

        return sprintf(
            'Hi-%s-%s-%s-%s',
            substr($chars, 0, 4),
            substr($chars, 4, 4),
            substr($chars, 8, 4),
            substr($chars, 12, 4),
        );
    }

    public function isValidCode(?string $code): bool
    {
        return is_string($code) && preg_match('/^Hi-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}$/', $code) === 1;
    }

    /**
     * @param  array<string, mixed>|null  $colors
     */
    public function isComplete(?array $colors): bool
    {
        if ($colors === null) {
            return false;
        }

        foreach (self::ELEMENT_IDS as $id) {
            $value = $colors[$id] ?? null;
            if (! is_string($value) || ! preg_match('/^#[0-9a-fA-F]{6}$/', $value)) {
                return false;
            }
        }

        return true;
    }

    private function hashString(string $value): int
    {
        $hash = 2166136261;

        for ($i = 0, $length = strlen($value); $i < $length; $i++) {
            $hash ^= ord($value[$i]);
            $hash = $this->imul32($hash, 16777619);
        }

        return $this->toUint32($hash);
    }

    /**
     * @return callable(): float
     */
    private function createSeededRandom(string $seed): callable
    {
        $state = $this->hashString($seed) ?: 1;

        return function () use (&$state): float {
            $state = $this->toInt32($state + 0x6D2B79F5);
            $t = $this->imul32(
                $state ^ $this->unsignedShiftRight($state, 15),
                1 | $state,
            );
            $t = $this->toInt32(
                $t ^ ($t + $this->imul32($t ^ $this->unsignedShiftRight($t, 7), 61 | $t)),
            );

            return $this->toUint32($t ^ $this->unsignedShiftRight($t, 14)) / 4294967296;
        };
    }

    /**
     * @param  callable(): float  $random
     */
    private function pickColorInSector(int $sectorIndex, callable $random): string
    {
        $hueSpan = 360 / self::SECTOR_COUNT;
        $hue = fmod($sectorIndex * $hueSpan + $random() * $hueSpan, 360);
        $saturation = self::SATURATION_MIN + $random() * (self::SATURATION_MAX - self::SATURATION_MIN);
        $lightness = self::LIGHTNESS_MIN + $random() * (self::LIGHTNESS_MAX - self::LIGHTNESS_MIN);

        return $this->hslToHex($hue, $saturation, $lightness);
    }

    private function hslToHex(float $h, float $s, float $l): string
    {
        $sat = $s / 100;
        $light = $l / 100;
        $chroma = (1 - abs(2 * $light - 1)) * $sat;
        $huePrime = $h / 60;
        $x = $chroma * (1 - abs(fmod($huePrime, 2) - 1));
        $r1 = 0.0;
        $g1 = 0.0;
        $b1 = 0.0;

        if ($huePrime >= 0 && $huePrime < 1) {
            $r1 = $chroma;
            $g1 = $x;
        } elseif ($huePrime < 2) {
            $r1 = $x;
            $g1 = $chroma;
        } elseif ($huePrime < 3) {
            $g1 = $chroma;
            $b1 = $x;
        } elseif ($huePrime < 4) {
            $g1 = $x;
            $b1 = $chroma;
        } elseif ($huePrime < 5) {
            $r1 = $x;
            $b1 = $chroma;
        } else {
            $r1 = $chroma;
            $b1 = $x;
        }

        $m = $light - $chroma / 2;
        $r = (int) round(($r1 + $m) * 255);
        $g = (int) round(($g1 + $m) * 255);
        $b = (int) round(($b1 + $m) * 255);

        return sprintf('#%02x%02x%02x', $r, $g, $b);
    }

    private function toUint32(int $value): int
    {
        return $value & 0xFFFFFFFF;
    }

    private function unsignedShiftRight(int $value, int $bits): int
    {
        return $this->toUint32($value) >> $bits;
    }

    private function toInt32(int|float $value): int
    {
        $value = $this->toUint32((int) $value);

        if ($value >= 0x80000000) {
            return $value - 0x100000000;
        }

        return $value;
    }

    private function imul32(int $a, int $b): int
    {
        return $this->toInt32($this->toInt32($a) * $this->toInt32($b));
    }
}
