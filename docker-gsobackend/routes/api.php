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
use App\Http\Controllers\PositionController;
use App\Http\Controllers\OfficeController;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\RoleController;
use App\Models\MaintenanceType;
Route::get('/maintenance-requests/list-with-details', [MaintenanceRequestController::class, 'indexWithDetails']);

Route::get('/maintenance-types', [MaintenanceTypeController::class, 'index']);

// Public Routes (Authentication)
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
//Route::post('/logout', [UserController::class, 'logout']);

Route::middleware('auth:sanctum')->post('/logout', [UserController::class, 'logout']);

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


//only staff and head
//staff fills up the remaining fields and verifies it
Route::middleware(['auth:sanctum'])->put('/maintenance-requests/{id}/verify', [MaintenanceRequestController::class, 'verify']);

//2 heads approves the maintenance request
Route::middleware(['auth:sanctum'])->put('/maintenance-requests/{id}/approve', [MaintenanceRequestController::class, 'approve']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::put('/maintenance-requests/{id}/approve-head', [MaintenanceRequestController::class, 'approveByHead']);
    Route::put('/maintenance-requests/{id}/approve-director', [MaintenanceRequestController::class, 'approveByDirector']);
});


//dissaproved
Route::middleware(['auth:sanctum'])->put('/maintenance-requests/{id}/disapprove', [MaintenanceRequestController::class, 'disapprove']);

//staff would get the maintenance request filled by the requester
Route::middleware(['auth:sanctum'])->get('/staffpov/{id}', [MaintenanceRequestController::class, 'staffpov']);
//staff would know used numbers for setting priority numbers
Route::middleware(['auth:sanctum'])->get('/maintenance-requests/priority-numbers', [MaintenanceRequestController::class, 'getUsedPriorityNumbers']);
// Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/maintenance-requests', [MaintenanceRequestController::class, 'index']);
// });

//denies the request by a staff
Route::middleware(['auth:sanctum'])->put('/maintenance-requests/{id}/deny', [MaintenanceRequestController::class, 'denyRequest']);

//saves the date and time the moment a staff views a request
Route::middleware(['auth:sanctum'])->put('/maintenance-requests/{id}/view', [MaintenanceRequestController::class, 'autosaveDateTime']);



//for schedules
Route::middleware(['auth:sanctum'])->get('/schedules', [MaintenanceRequestController::class, 'getSchedules']);

//getfullname
Route::get('/users/{id}/fullname', [UserController::class, 'getFullName'])
    ->middleware('auth:sanctum');
//gets the id and fullname
Route::get('/users/idfullname', [UserController::class, 'getAuthenticatedUserInfo'])
    ->middleware('auth:sanctum');

//gets the id,fullname, office, position, contactnumber
Route::middleware(['auth:sanctum'])->get('/users/reqInfo', [UserController::class, 'getUserDetails']);

Route::middleware(['auth:sanctum'])->get('/users/userWithRole', [UserController::class, 'getUserDetailRole']);
//head would get the maintenance request filled by the requester and staff
Route::middleware(['auth:sanctum'])->get('/headpov/{id}', [MaintenanceRequestController::class, 'headpov']);
Route::middleware(['auth:sanctum'])->get('/directorpov/{id}', [MaintenanceRequestController::class, 'directorpov']);






//admin approval of account
Route::middleware('auth:sanctum')->group(function () {
    //admin approves the account of user
    Route::put('/users/{id}/updateAccountStatus', [UserController::class, 'updateAccountStatus']);
    //gets all pending approvals
    Route::get('/pending-approvals', [UserController::class, 'getPendingApprovals']);
    Route::get('/uspass', [UserController::class, 'getUsPass']);
});

//admin adding of maintenance type
Route::middleware(['auth:sanctum'])->post('/addservice',[MaintenanceTypeController::class, 'store']);


//users feedback
Route::middleware(['auth:sanctum'])->post('/feedbacks', [FeedbackController::class, 'store']);
//get the details of the feedback
Route::middleware('auth:sanctum')->get('/feedbacks/{id}/details', [FeedbackController::class, 'showFeedbackDetails']);

Route::get('/feedbacks', [FeedbackController::class, 'index']);


//create maintenancerequestform
Route::middleware('auth:sanctum')->group(function () {
    // Maintenance Requests
    Route::apiResource('/maintenance-requests', MaintenanceRequestController::class);
});










//this section is for the non functional requirements



//cancels the request
Route::put('/maintenance-requests/{id}/cancel', [MaintenanceRequestController::class, 'cancelRequest']);


//edit request form
Route::middleware('auth:sanctum')->put('/maintenance-requests/{id}/editDetails', [MaintenanceRequestController::class, 'updateDetails']);

//edit user info
Route::middleware('auth:sanctum')->put('/profile/update', [UserController::class, 'updateProfile']);

//return all user's info
Route::middleware('auth:sanctum')->get('/profile/userInfos', [UserController::class, 'userDetails']);


//for notifications
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unreadCount', [NotificationController::class, 'unreadCount']);
    Route::put('/notifications/markAsRead/{id}', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/markAllAsRead', [NotificationController::class, 'markAllAsRead']);
});


//can get, create, edit, delete roles, position, office, status, maintenance-types
Route::apiResource('roles', RoleController::class);
Route::apiResource('positions', PositionController::class);
Route::apiResource('offices', OfficeController::class);
Route::apiResource('statuses', StatusController::class);
Route::apiResource('maintenance-types', MaintenanceTypeController::class);


Route::put('/maintenance-requests/{id}/mark-urgent', [MaintenanceRequestController::class, 'markAsUrgent']);
Route::put('/maintenance-requests/{id}/mark-onhold', [MaintenanceRequestController::class, 'markAsOnHold']);















//translated datas

Route::get('/common-datas', [UserController::class, 'commonDatas']);
Route::get('/maintenance-requests/list-with-details', [MaintenanceRequestController::class, 'indexWithDetails']);
















