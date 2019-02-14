<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'name' => 'admin',
            'email' => 'admin@admin.com',
            'password' => bcrypt('adminadmin'),
            'phone' => rand(1000, 10000),
            'address' => str_random(20),
            'image' => 'user.png',
            'role_id' => 1,
        ]);
    }
}
