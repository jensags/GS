<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MaintenanceRequest;
use Illuminate\Validation\ValidationException;

class MaintenanceRequestController extends Controller
{
    // Get all maintenance requests
    public function index()
    {
        return response()->json(MaintenanceRequest::all());
    }

    // Store a new maintenance request
    public function store(Request $request)
    {
        $validated = $request->validate([
            'request_id' => 'required|exists:requests,id',
            'maintenance_type_id' => 'required|exists:maintenance_types,id',
            'date_received' => 'required|date',
            'time_received' => 'required',
            'priority_number' => 'required|integer',
            'signature' => 'required|string',
        ]);

        $newRequest = MaintenanceRequest::create($validated);
        return response()->json($newRequest, 201);
    }

    // Show a single maintenance request
    public function show($id)
    {
        return response()->json(MaintenanceRequest::findOrFail($id));
    }

    // Update a maintenance request
    public function update(Request $request, $id)
    {
        $existingRequest = MaintenanceRequest::findOrFail($id);
        $existingRequest->update($request->all());
        return response()->json($existingRequest);
    }

    // Delete a maintenance request
    public function destroy($id)
    {
        MaintenanceRequest::destroy($id);
        return response()->json(['message' => 'Maintenance Request deleted']);
    }
}
