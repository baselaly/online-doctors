<?php

namespace App\Http\Controllers\adminController;

use App\Http\Controllers\Controller;
use App\Role;
use Illuminate\Http\Request;

class rolecontroller extends Controller
{
    protected $model;
    protected $request;
    public function __construct(Role $model, Request $request)
    {
        $this->model = $model;
        $this->request = $request;
    }

    public function addRole()
    {
        $this->validate($this->request, $this->model->rules());
        $role = new $this->model;
        $role->name = $this->request->name;
        $DONE = $role->save();
        if (!$DONE) {
            return response()->json('failed', 500);
        }
        return response()->json('role added', 200);
    }

    public function editRole($id)
    {
        $this->validate($this->request, $this->model->rules());
        $role = $this->model->find($id);
        $role->name = $this->request->name;
        $DONE = $role->save();
        if (!$DONE) {
            return response()->json('failed', 500);
        }
        return response()->json('role edited', 200);
    }

    public function deleteRole($id)
    {
        $role = $this->model->find($id);
        $DONE = $role->delete();
        if (!$DONE) {
            return response()->json('failed', 500);
        }
        return response()->json('role deleted', 200);
    }

    public function getAll()
    {
        $roles = $this->model->all();
        if (!$roles) {
            return response()->json("no roles", 404);
        }
        return response()->json(compact('roles'), 200);
    }
}
