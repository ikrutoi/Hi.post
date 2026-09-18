<?php

namespace App\Domain\Postcard;

/**
 * Phase 0 inventory: IndexedDB AppDB `postcards` (PostcardHydrated) is the
 * product shape. Legacy Laravel `postcards` / sender|recipient|text template
 * tables are dropped. Snapshot table is imported into `user_postcards` then dropped.
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

    /** Dropped; do not recreate. */
    public const DROPPED_TABLES = [
        'postcards',
        'sender_templates',
        'recipient_templates',
        'text_templates',
        'user_postcard_snapshots',
    ];

    /** Still in the DB: system catalog only — do not add user writes. */
    public const FROZEN_TABLES = [
        'image_templates',
    ];

    /** Auth, v2 cloud copy, files, system catalog rows in image_templates. */
    public const LIVE_TABLES = [
        'users',
        'personal_access_tokens',
        'user_files',
        'user_postcards',
        'user_library_items',
        'image_templates',
    ];
}
