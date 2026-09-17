<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Postcard;

class PostcardController extends Controller
{
    /**
     * FROZEN CRUD over legacy `postcards` (phase 0).
     * New postcard API must not land here — use sync snapshots, then a new schema.
     *
     * @see \App\Domain\Postcard\BackendCanon
     */
    public function index()
    {
        return Postcard::where('is_active', true)->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
