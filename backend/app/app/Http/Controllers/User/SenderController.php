<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\FrozenResourceController;

/**
 * Retired. Table `sender_templates` is dropped.
 *
 * @see \App\Domain\Postcard\BackendCanon
 */
class SenderController extends FrozenResourceController
{
    protected function successorMessage(): string
    {
        return 'Sender templates are retired.';
    }
}
