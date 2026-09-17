<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserFile;
use App\Services\UserFileStore;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Phase 2: postcard photos live on disk, not in JSON snapshots.
 * Variants: original, factory display, thumb. Postcard rows store only `id`.
 */
class UserFileController extends Controller
{
    public const MAX_KILOBYTES = 12288;

    public function __construct(
        private readonly UserFileStore $files,
    ) {}

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'original' => ['required', 'file', 'mimes:jpeg,jpg,png,webp', 'max:'.self::MAX_KILOBYTES],
            'display' => ['nullable', 'file', 'mimes:jpeg,jpg,png,webp', 'max:'.self::MAX_KILOBYTES],
            'thumb' => ['nullable', 'file', 'mimes:jpeg,jpg,png,webp', 'max:'.self::MAX_KILOBYTES],
            'originalWidth' => ['nullable', 'integer', 'min:1', 'max:20000'],
            'originalHeight' => ['nullable', 'integer', 'min:1', 'max:20000'],
            'displayWidth' => ['nullable', 'integer', 'min:1', 'max:20000'],
            'displayHeight' => ['nullable', 'integer', 'min:1', 'max:20000'],
            'thumbWidth' => ['nullable', 'integer', 'min:1', 'max:20000'],
            'thumbHeight' => ['nullable', 'integer', 'min:1', 'max:20000'],
        ]);

        $file = $this->files->put(
            $request->user(),
            $request->file('original'),
            $request->file('display'),
            $request->file('thumb'),
            $validated,
        );

        return response()->json($this->formatFile($file), 201);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $file = $this->ownedFile($request, $id);

        return response()->json($this->formatFile($file));
    }

    public function variant(Request $request, string $id, string $variant): StreamedResponse
    {
        abort_unless(in_array($variant, UserFileStore::VARIANTS, true), 404);

        $file = $this->ownedFile($request, $id);
        $path = $file->pathForVariant($variant);
        $mime = $file->mimeForVariant($variant);

        abort_unless(is_string($path) && $path !== '', 404);
        abort_unless(Storage::disk(UserFileStore::DISK)->exists($path), 404);

        return Storage::disk(UserFileStore::DISK)->response(
            $path,
            basename($path),
            ['Content-Type' => $mime ?: 'application/octet-stream'],
        );
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $file = $this->ownedFile($request, $id);
        $this->files->delete($file);

        return response()->json(['message' => 'File deleted']);
    }

    private function ownedFile(Request $request, string $id): UserFile
    {
        return UserFile::query()
            ->where('user_id', $request->user()->id)
            ->whereKey($id)
            ->firstOrFail();
    }

    /**
     * @return array{
     *     id: string,
     *     original: array{url: string, mime: string, size: int, width: int|null, height: int|null},
     *     display: array{url: string, mime: string, size: int, width: int|null, height: int|null},
     *     thumb: array{url: string, mime: string, size: int, width: int|null, height: int|null}|null
     * }
     */
    private function formatFile(UserFile $file): array
    {
        $original = [
            'url' => "/api/files/{$file->id}/original",
            'mime' => $file->original_mime,
            'size' => (int) $file->original_size,
            'width' => $file->original_width,
            'height' => $file->original_height,
        ];

        $display = [
            'url' => "/api/files/{$file->id}/display",
            'mime' => $file->display_mime ?: $file->original_mime,
            'size' => (int) ($file->display_size ?: $file->original_size),
            'width' => $file->display_width ?: $file->original_width,
            'height' => $file->display_height ?: $file->original_height,
        ];

        $thumb = $file->thumb_path
            ? [
                'url' => "/api/files/{$file->id}/thumb",
                'mime' => $file->thumb_mime ?: 'application/octet-stream',
                'size' => (int) $file->thumb_size,
                'width' => $file->thumb_width,
                'height' => $file->thumb_height,
            ]
            : null;

        return [
            'id' => $file->id,
            'original' => $original,
            'display' => $display,
            'thumb' => $thumb,
        ];
    }
}
