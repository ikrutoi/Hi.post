<?php

namespace App\Domain\Postcard;

final class PostcardPayloadSanitizer
{
    public static function sanitize(mixed $value): mixed
    {
        if (is_array($value)) {
            $out = [];
            foreach ($value as $key => $item) {
                if ($key === 'blob') {
                    continue;
                }
                $out[$key] = self::sanitize($item);
            }

            return $out;
        }

        if (is_string($value) && str_starts_with($value, 'blob:')) {
            return '';
        }

        return $value;
    }
}
