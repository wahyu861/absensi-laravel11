<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    static function isTodayAttendanceSubmitted(): bool
    {
        if (!Auth::check()) {
            return false;
        }

        return Attendance::where("user_id", Auth::user()->id)
            ->whereDate("created_at", now()->toDateString())
            ->exists();
    }

    public function submit(Request $request)
    {
        $request->validate([
            'status' => 'required',
            'description' => 'required_if:status,sick,leave,permit,business_trip,remote|max:500',
            'latitude' => 'required',
            'longitude' => 'required',
            'address' => 'required'
        ]);

        Attendance::create([
            'user_id' => Auth::id(),
            'status' => $request->status,
            'description' => $request->description,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'address' => $request->address
        ]);

        return redirect()->route('dashboard');
    }
}
