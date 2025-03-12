<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string',
            'position' => 'required|string',
            'office' => 'required|string',
            'contact_number' => 'required|string',
            'password' => 'required|string|min:6',
            'role' => 'required|string|in:requester,approver'
        ]);

        $user = User::create([
            'full_name' => $request->full_name,
            'position' => $request->position,
            'office' => $request->office,
            'contact_number' => $request->contact_number,
            'password' => Hash::make($request->password),
            'role' => $request->role
        ]);

        return response()->json(['message' => 'User registered successfully'], 201);
    }





    public function login(Request $request)
    {
        $request->validate([
            'id' => 'required|integer',
            'password' => 'required|string'
        ]);

        $user = User::where('id', $request->id)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'message' => ['Invalid credentials']
            ]);
        }

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user], 200);
    }






    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out'], 200);
    }

    public function userDetails(Request $request)
    {
        return response()->json($request->user(), 200);
    }
}
