<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\FrozenResourceController;

/**
 * Frozen CRUD over legacy `postcards`. Use /api/v2/postcards.
 *
 * @see \App\Domain\Postcard\BackendCanon
 */
class PostcardController extends FrozenResourceController
{
    protected function successorMessage(): string
    {
        return 'Legacy postcards are frozen. Use /api/v2/postcards.';
    }
}
