<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MaintenanceRequest;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;

class MaintenanceRequestController extends Controller
{
    // Get all maintenance requests
    public function index()
    {
        $maintenanceRequests = MaintenanceRequest::orderBy('date_requested', 'desc')->get();

        return response()->json([
            'message' => 'List of maintenance requests retrieved successfully.',
            'data' => $maintenanceRequests
        ], 200);
    }

    // Store a new maintenance request
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date_requested' => 'required|date',
            'details' => 'required|string',
            'requesting_personnel' => 'required|string',
            'position' => 'required|string',
            'requesting_office' => 'required|string',
            'contact_number' => 'required|string',
        ]);

        $maintenanceRequest = MaintenanceRequest::create([
            'date_requested' => $validated['date_requested'],
            'details' => $validated['details'],
            'requesting_personnel' => $validated['requesting_personnel'],
            'position' => $validated['position'],
            'requesting_office' => $validated['requesting_office'],
            'contact_number' => $validated['contact_number'],
            'status' => 'Pending',
        ]);

        return response()->json(['message' => 'Maintenance request submitted successfully.', 'data' => $maintenanceRequest], 201);
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


    public function review(Request $request, $id)
    {
        $validated = $request->validate([
            'date_received' => 'required|date',
            'time_received' => 'required',
            'priority_number' => 'required|string',
            'remarks' => 'nullable|string',
        ]);

        $maintenanceRequest = MaintenanceRequest::findOrFail($id);

        if ($maintenanceRequest->status !== 'Pending') {
            return response()->json(['message' => 'Request has already been processed.'], 400);
        }

        $maintenanceRequest->update([
            'date_received' => $validated['date_received'],
            'time_received' => $validated['time_received'],
            'priority_number' => $validated['priority_number'],
            'remarks' => $validated['remarks'],
            'verified_by' => Auth::id(),
        ]);

        return response()->json(['message' => 'Maintenance request details updated successfully.', 'data' => $maintenanceRequest], 200);
    }



    public function approve($id)
    {
        $maintenanceRequest = MaintenanceRequest::findOrFail($id);

        if ($maintenanceRequest->status !== 'Pending') {
            return response()->json(['message' => 'Request has already been processed.'], 400);
        }

        $userId = Auth::id();

        // If first approver is empty, assign the current user
        if (!$maintenanceRequest->approved_by_1) {
            $maintenanceRequest->approved_by_1 = $userId;
        }
        // If second approver is empty and different from first approver, assign the current user
        elseif (!$maintenanceRequest->approved_by_2 && $maintenanceRequest->approved_by_1 !== $userId) {
            $maintenanceRequest->approved_by_2 = $userId;
            $maintenanceRequest->status = 'Approved'; // Final approval after two approvers
        } else {
            return response()->json(['message' => 'You have already approved this request or approval is complete.'], 400);
        }

        $maintenanceRequest->save();

        return response()->json(['message' => 'Request approval recorded.', 'data' => $maintenanceRequest], 200);
    }

}
