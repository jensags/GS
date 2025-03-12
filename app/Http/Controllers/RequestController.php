<?php
namespace App\Http\Controllers;

use App\Models\Request;
use Illuminate\Http\Request as HttpRequest;

class RequestController extends Controller
{
    public function index()
    {
        return Request::all();
    }

    public function store(HttpRequest $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'request_type' => 'required|string',
            'date_requested' => 'required|date',
            'status' => 'required|string'
        ]);

        return Request::create($validated);
    }

    public function show($id)
    {
        return Request::findOrFail($id);
    }

    public function update(HttpRequest $request, $id)
    {
        $validated = $request->validate([
            'request_type' => 'sometimes|string',
            'date_requested' => 'sometimes|date',
            'status' => 'sometimes|string'
        ]);

        $req = Request::findOrFail($id);
        $req->update($validated);

        return $req;
    }

    public function destroy($id)
    {
        return Request::destroy($id);
    }

    public function approve($id)
    {
        $req = Request::findOrFail($id);
        $req->status = 'Approved';
        $req->save();

        return response()->json(['message' => 'Request approved']);
    }
}
