<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\FrozenResourceController;

/**
 * Legacy `/api/postcards` (410). Table `postcards` is dropped.
 *
 * @see \App\Domain\Postcard\BackendCanon
 */
class PostcardController extends FrozenResourceController
{
    protected function successorMessage(): string
    {
        return 'Legacy postcards are gone. Use /api/v2/postcards.';
    }
}
