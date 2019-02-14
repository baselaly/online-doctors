<?php

namespace App\Http\Controllers\adminController;

use App\Category;
use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;

class categorycontroller extends Controller
{
    protected $model;
    protected $request;
    protected $user_model;

    public function __construct(Category $model, Request $request, User $user_model)
    {
        $this->model = $model;
        $this->request = $request;
        $this->user_model = $user_model;
    }

    public function addCategory()
    {
        $this->validate($this->request, $this->model->rules());
        $category = new $this->model;
        $category->name = $this->request->name;
        $DONE = $category->save();
        if (!$DONE) {
            return response()->json("failed", 500);
        }
        return response()->json("category added", 200);
    }

    public function editCategory($id)
    {
        $this->validate($this->request, $this->model->rules());
        $category = $this->model->findOrFail($id);
        $category->name = $this->request->name;
        $DONE = $category->save();
        if (!$DONE) {
            return response()->json("failed", 500);
        }
        return response()->json("category edited", 200);
    }

    public function deleteCategory($id)
    {
        $category = $this->model->findOrFail($id);
        $users = $category->users;
        if (count($users) > 0) {
            return response()->json('there is doctors in that section', 403);
        }
        $DONE = $category->delete();
        if (!$DONE) {
            return response()->json("failed", 500);
        }
        return response()->json("category deleted", 200);
    }

    public function getAll()
    {
        $categories = $this->model->paginate(10);
        if (!$categories) {
            return response()->json("no categories", 404);
        }
        return response()->json(compact('categories'), 200);
    }

    public function getAllForUsers()
    {
        $categories = $this->model->all();
        if (!$categories) {
            return response()->json("no categories", 404);
        }
        return response()->json(compact('categories'), 200);
    }

    public function getById($id)
    {
        $category = $this->model->findOrFail($id);
        $category['doctors_count'] = $this->user_model->where('category_id', $category->id)->count();
        if (!$category) {
            return response()->json("not found", 500);
        }
        return response()->json(compact('category'), 200);
    }
}
