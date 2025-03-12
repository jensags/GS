<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Feedback;
use Illuminate\Validation\ValidationException;

class FeedbackController extends Controller
{
    // Get all feedback
    public function index()
    {
        return response()->json(Feedback::all());
    }

    // Store new feedback
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'service_id' => 'required|exists:services,id', // Adjust based on your database structure
                'rating' => 'required|integer|min:1|max:5',
                'comments' => 'nullable|string',
            ]);

            $feedback = Feedback::create($validated);

            return response()->json($feedback, 201);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

    // Show a specific feedback
    public function show($id)
    {
        return response()->json(Feedback::findOrFail($id));
    }

    // Update feedback
    public function update(Request $request, $id)
    {
        $feedback = Feedback::findOrFail($id);
        $validated = $request->validate([
            'rating' => 'sometimes|integer|min:1|max:5',
            'comments' => 'sometimes|string',
        ]);

        $feedback->update($validated);

        return response()->json($feedback);
    }

    // Delete feedback
    public function destroy($id)
    {
        Feedback::destroy($id);
        return response()->json(['message' => 'Feedback deleted']);
    }
}
