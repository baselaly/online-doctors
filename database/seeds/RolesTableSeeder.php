<?php

use Illuminate\Database\Seeder;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $roles = [
            ['id' => 1, 'name' => 'admin'],
            ['id' => 2, 'name' => 'doctor'],
            ['id' => 4, 'name' => 'user'],
        ];
        foreach ($roles as $role) {
            DB::table('roles')->insert($role);
        }
    }
}
