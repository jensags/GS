<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\MaintenanceRequestController;
use App\Http\Controllers\TransportationRequestController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\MaintenanceTypeController;
use App\Http\Controllers\NotificationController;





Route::get('/maintenance-types', [MaintenanceTypeController::class, 'index']);

// Public Routes (Authentication)
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);


//for test only
Route::get('/message', function(){
    return "hehehe";
});
Route::get('/test', function () {
    return response()->json(['message' => 'API is working!']);
});

Route::post('/test-register', function () {
    return response()->json(['message' => 'Register route is working!']);
});




// Protected Routes (Require Authentication)
// Routes for Approvers Only
Route::middleware(['auth:sanctum', 'role:approver'])->group(function () {
    Route::put('/requests/{id}/approve', [RequestController::class, 'approve']); // Only approvers can approve requests
});

// General Routes for Authenticated Users
Route::middleware('auth:sanctum')->group(function () {
    // Requests
    Route::apiResource('/requests', RequestController::class);

    // Maintenance Requests
    Route::apiResource('/maintenance-requests', MaintenanceRequestController::class);

    // Transportation Requests
    Route::apiResource('/transportation-requests', TransportationRequestController::class);

    // Feedback
    Route::apiResource('/feedback', FeedbackController::class);
});



//for notifications
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']); // Get all notifications
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']); // Mark as read
});



Route::middleware(['auth:sanctum'])->group(function () {
    // Approver updates maintenance request details
    Route::put('/maintenance-requests/{id}/review', [MaintenanceRequestController::class, 'review']);

    // Two-step approval process
    Route::put('/maintenance-requests/{id}/approve', [MaintenanceRequestController::class, 'approve']);
});




Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/maintenance-requests', [MaintenanceRequestController::class, 'index']);
});
