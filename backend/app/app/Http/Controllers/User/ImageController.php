<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\FrozenResourceController;

/**
 * Frozen user image-template CRUD. System catalog stays on GET templates/images/system.
 * User cardphoto templates: /api/v2/cardphotos + /api/files.
 */
class ImageController extends FrozenResourceController
{
    protected function successorMessage(): string
    {
        return 'User image templates use /api/v2/cardphotos.';
    }
}
