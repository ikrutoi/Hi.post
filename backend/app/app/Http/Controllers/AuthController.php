<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\PassportColorGenerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(
        private readonly PassportColorGenerator $passportColorGenerator,
    ) {}

    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'is_active' => true,
            'role' => 'user',
        ]);

        return response()->json([
            'user' => $this->formatUser($user),
            'token' => $user->createToken('HiPostToken')->plainTextToken,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Incorrect email and password'],
            ]);
        }

        if (! $user->is_active) {
            throw ValidationException::withMessages([
                'email' => ['This account has been deactivated'],
            ]);
        }

        return response()->json([
            'user' => $this->formatUser($user),
            'token' => $user->createToken('HiPostToken')->plainTextToken,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'The exit is complete']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json($this->formatUser($request->user()));
    }

    public function updateAvatar(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'avatarUrl' => ['nullable', 'string', 'max:700000'],
        ]);

        $avatarUrl = $validated['avatarUrl'] ?? null;

        if ($avatarUrl !== null && ! preg_match('/^data:image\/(jpeg|png|webp);base64,/', $avatarUrl)) {
            throw ValidationException::withMessages([
                'avatarUrl' => ['Invalid avatar image format'],
            ]);
        }

        $user = $request->user();
        $user->avatar_url = $avatarUrl;
        $user->save();

        return response()->json($this->formatUser($user->fresh()));
    }

    /**
     * @return array{
     *     id: string,
     *     name: string,
     *     email: string,
     *     avatarUrl: string|null,
     *     passportColors: array<string, string>
     * }
     */
    private function formatUser(User $user): array
    {
        $user = $this->passportColorGenerator->ensureForUser($user);

        return [
            'id' => (string) $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'avatarUrl' => $user->avatar_url,
            'passportColors' => $user->passport_colors,
        ];
    }
}
