<?php

namespace App\Http\Controllers\adminController;

use App\Feedback;
use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;

class feedbackcontroller extends Controller
{
    protected $model;
    protected $request;
    protected $user_model;

    public function __construct(Feedback $model, Request $request, User $user_model)
    {
        $this->model = $model;
        $this->request = $request;
        $this->user_model = $user_model;
    }

    public function addFeedback()
    {
        $this->validate($this->request, $this->model->rules());
        $patient = $this->user_model->where([
            'category_id' => null,
            'id' => $this->request->patient_id,
        ])->first();
        $doctor = $this->user_model->where('category_id', '!=', null)->where('id', $this->request->doctor_id)->first();
        if ($doctor && $patient) {
            $feedback = new $this->model;
            $feedback->feedback = $this->request->feedback;
            $feedback->patient_id = $this->request->patient_id;
            $feedback->doctor_id = $this->request->doctor_id;
            $DONE = $feedback->save();
            if (!$DONE) {
                return response()->json('something went wrong', 500);
            }
            return response()->json('feedback added', 200);
        }
        return response()->json('error', 500);
    }

    public function editFeedback($id)
    {
        $this->validate($this->request, $this->model->rules());
        $patient = $this->user_model->where([
            'category_id' => null,
            'id' => $this->request->patient_id,
        ])->first();
        $doctor = $this->user_model->where('category_id', '!=', null)->where('id', $this->request->doctor_id)->first();
        if ($doctor && $patient) {
            $feedback = $this->model->findOrFail($id);
            $feedback->feedback = $this->request->feedback;
            $feedback->patient_id = $this->request->patient_id;
            $feedback->doctor_id = $this->request->doctor_id;
            $DONE = $feedback->save();
            if (!$DONE) {
                return response()->json('something went wrong', 500);
            }
            return response()->json('feedback edited', 200);
        }
        return response()->json('error', 500);
    }

    public function deleteFeedback($id)
    {
        $feedback = $this->model->findOrFail($id);
        $DONE = $feedback->delete();
        if (!$DONE) {
            return response()->json('something went wrong', 500);
        }
        return response()->json('deleted', 200);
    }

    public function getAll()
    {
        $feedbacks = $this->model->paginate(10);
        if (!$feedbacks) {
            return response()->json('no feedbacks', 404);
        }
        foreach ($feedbacks as $feedback) {
            $feedback->doctor;
            $feedback->patient;
        }
        return response()->json(compact('feedbacks'), 200);
    }

    public function getById($id)
    {
        $feedback = $this->model->findOrFail($id);
        $feedback->doctor;
        $feedback->patient;
        return response()->json(compact('feedback'), 200);
    }
}
