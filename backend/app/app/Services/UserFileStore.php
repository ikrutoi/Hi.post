<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserFile;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UserFileStore
{
    public const VARIANTS = ['original', 'display', 'thumb'];

    public const DISK = 'local';

    public function put(
        User $user,
        UploadedFile $original,
        ?UploadedFile $display,
        ?UploadedFile $thumb,
        array $dimensions = [],
    ): UserFile {
        $id = (string) Str::uuid();
        $dir = "user-files/{$user->id}/{$id}";

        $originalStored = $this->storeVariant($dir, 'original', $original);
        $displayStored = $display ? $this->storeVariant($dir, 'display', $display) : null;
        $thumbStored = $thumb ? $this->storeVariant($dir, 'thumb', $thumb) : null;

        return UserFile::query()->create([
            'id' => $id,
            'user_id' => $user->id,
            'original_path' => $originalStored['path'],
            'original_mime' => $originalStored['mime'],
            'original_size' => $originalStored['size'],
            'original_width' => $dimensions['originalWidth'] ?? null,
            'original_height' => $dimensions['originalHeight'] ?? null,
            'display_path' => $displayStored['path'] ?? null,
            'display_mime' => $displayStored['mime'] ?? null,
            'display_size' => $displayStored['size'] ?? null,
            'display_width' => $dimensions['displayWidth'] ?? null,
            'display_height' => $dimensions['displayHeight'] ?? null,
            'thumb_path' => $thumbStored['path'] ?? null,
            'thumb_mime' => $thumbStored['mime'] ?? null,
            'thumb_size' => $thumbStored['size'] ?? null,
            'thumb_width' => $dimensions['thumbWidth'] ?? null,
            'thumb_height' => $dimensions['thumbHeight'] ?? null,
        ]);
    }

    public function delete(UserFile $file): void
    {
        $disk = Storage::disk(self::DISK);
        foreach ([$file->original_path, $file->display_path, $file->thumb_path] as $path) {
            if (is_string($path) && $path !== '') {
                $disk->delete($path);
            }
        }
        $file->delete();
    }

    /**
     * @return array{path: string, mime: string, size: int}
     */
    private function storeVariant(string $dir, string $variant, UploadedFile $upload): array
    {
        $extension = strtolower($upload->getClientOriginalExtension() ?: 'bin');
        $filename = "{$variant}.{$extension}";
        $path = $upload->storeAs($dir, $filename, self::DISK);
        if (! is_string($path) || $path === '') {
            throw new \RuntimeException('Failed to store uploaded file');
        }

        return [
            'path' => $path,
            'mime' => $upload->getMimeType() ?: 'application/octet-stream',
            'size' => $upload->getSize() ?: 0,
        ];
    }
}
