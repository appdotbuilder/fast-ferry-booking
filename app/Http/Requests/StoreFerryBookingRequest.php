<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFerryBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'ferry_schedule_id' => 'required|exists:ferry_schedules,id',
            'travel_date' => 'required|date|after_or_equal:today',
            'passenger_name' => 'required|string|max:255',
            'passenger_email' => 'required|email|max:255',
            'passenger_phone' => 'required|string|max:20',
            'adults_count' => 'required|integer|min:1|max:10',
            'children_count' => 'required|integer|min:0|max:10',
            'payment_method' => 'required|in:office,bank_transfer',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'ferry_schedule_id.required' => 'Please select a ferry schedule.',
            'ferry_schedule_id.exists' => 'The selected ferry schedule is not valid.',
            'travel_date.required' => 'Please select a travel date.',
            'travel_date.after_or_equal' => 'Travel date must be today or later.',
            'passenger_name.required' => 'Passenger name is required.',
            'passenger_email.required' => 'Email address is required.',
            'passenger_email.email' => 'Please enter a valid email address.',
            'passenger_phone.required' => 'Phone number is required.',
            'adults_count.required' => 'Number of adult passengers is required.',
            'adults_count.min' => 'At least one adult passenger is required.',
            'adults_count.max' => 'Maximum 10 adult passengers allowed.',
            'children_count.max' => 'Maximum 10 child passengers allowed.',
            'payment_method.required' => 'Please select a payment method.',
            'payment_method.in' => 'Invalid payment method selected.',
        ];
    }
}