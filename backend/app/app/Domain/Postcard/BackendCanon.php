<?php

namespace App\Domain\Postcard;

/**
 * Phase 0 inventory: freeze legacy Laravel postcards; new schema follows
 * IndexedDB AppDB `postcards` (PostcardHydrated), not `postcards` columns.
 * Phase 6: client http mode treats v2 tables as the cloud copy; IDB is cache.
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

    /** Do not add columns, relations, or writes. Tables stay until a later drop. */
    public const FROZEN_TABLES = [
        'postcards',
        'sender_templates',
        'recipient_templates',
        'text_templates',
        'image_templates',
    ];

    /** Auth, v2 cloud copy, files, read-only snapshot, system catalog rows in image_templates. */
    public const LIVE_TABLES = [
        'users',
        'personal_access_tokens',
        'user_files',
        'user_postcards',
        'user_library_items',
        'user_postcard_snapshots',
        'image_templates',
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
