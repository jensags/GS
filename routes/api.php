<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\MaintenanceRequestController;
use App\Http\Controllers\TransportationRequestController;
use App\Http\Controllers\FeedbackController;

// Public Routes (Authentication)
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::get('/message', function(){
    return "hehehe";
});
Route::get('/test', function () {
    return response()->json(['message' => 'API is working!']);
});

// Protected Routes (Require Authentication)
Route::middleware(['auth:sanctum', 'role:approver'])->group(function () {
    Route::put('/requests/{id}/approve', [RequestController::class, 'approve']);

    // Requests
    Route::apiResource('/requests', RequestController::class);

    // Maintenance Requests
    Route::apiResource('/maintenance-requests', MaintenanceRequestController::class);

    // Transportation Requests
    Route::apiResource('/transportation-requests', TransportationRequestController::class);

    // Feedback
    Route::apiResource('/feedback', FeedbackController::class);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('maintenance-requests', MaintenanceRequestController::class);
    Route::apiResource('transportation-requests', TransportationRequestController::class);
    Route::apiResource('feedback', FeedbackController::class);
});
