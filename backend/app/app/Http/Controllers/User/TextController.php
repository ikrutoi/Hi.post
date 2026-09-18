<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\FrozenResourceController;

/**
 * Frozen stub. Cardtext templates are /api/v2/cardtexts.
 */
class TextController extends FrozenResourceController
{
    protected function successorMessage(): string
    {
        return 'Text templates use /api/v2/cardtexts.';
    }
}
