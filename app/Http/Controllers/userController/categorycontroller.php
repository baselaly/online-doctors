<?php

namespace App\Http\Controllers\userController;

use App\Category;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class categorycontroller extends Controller
{
    protected $model;
    protected $request;

    public function __construct(Category $model, Request $request)
    {
        $this->request = $request;
        $this->model = $model;
    }

    public function getCategories()
    {
        $categories = $this->model->all();
        return response()->json(compact('categories'));
    }
}
