<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\FrozenResourceController;

/**
 * Retired. Client unhooked `templates/senders`. Table `sender_templates` is frozen.
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
