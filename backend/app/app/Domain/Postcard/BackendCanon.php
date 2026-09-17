<?php

namespace App\Domain\Postcard;

/**
 * Phase 0 inventory: freeze legacy Laravel postcards; new schema follows
 * IndexedDB AppDB `postcards` (PostcardHydrated), not `postcards` columns.
 *
 * @see frontend/src/entities/postcard/domain/backendCanon.ts
 */
final class BackendCanon
{
    public const PHASE = 0;

    public const APP_DB_VERSION = 20;

    public const SYNC_PAYLOAD_VERSION = 1;

    /** @var list<string> */
    public const POSTCARD_STATUSES = [
        'cart',
        'cartBlocked',
        'ready',
        'sent',
        'delivered',
        'error',
    ];

    /** @var list<string> */
    public const POSTCARD_REF_KEYS = [
        'cardphoto',
        'cardtext',
        'recipient',
        'aroma',
    ];

    /** @var list<string> */
    public const ADDRESS_FIELDS = [
        'name',
        'street',
        'zip',
        'city',
        'country',
    ];

    /** Do not add columns, relations, or writes. */
    public const FROZEN_TABLES = [
        'postcards',
        'sender_templates',
    ];

    public const LIVE_TABLES = [
        'users',
        'user_postcard_snapshots',
        'recipient_templates',
        'text_templates',
        'image_templates',
        'personal_access_tokens',
        'user_files',
        'user_postcards',
    ];

    /**
     * Legacy `postcards.status` enum — not used by the client pipeline.
     *
     * @var list<string>
     */
    public const LEGACY_POSTCARD_STATUSES = [
        'draft',
        'scheduled',
        'sent',
        'archived',
    ];
}
