<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\FrozenResourceController;

/**
 * Frozen stub. Address book is /api/v2/addresses (IndexedDB shape).
 */
class RecipientController extends FrozenResourceController
{
    protected function successorMessage(): string
    {
        return 'Address book uses /api/v2/addresses.';
    }
}
