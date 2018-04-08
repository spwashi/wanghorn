<?php


namespace WANGHORN\Controller\User;


use Sm\Application\Controller\BaseApplicationController;
use Sm\Data\Entity\Exception\EntityModelNotFoundException;
use Sm\Data\Model\Exception\ModelNotFoundException;
use WANGHORN\Entity\User\User;

class UserController extends BaseApplicationController {
    public function userByID($id) {
        $Sam = User::init($this->app->data->models)
                   ->find([
                              'email' => $id,
                          ]);
        return $Sam;
    }
    public function login() {
        $email_address = $_POST['username'] ?? null;
        $password      = $_POST['password'] ?? null;
        
        # Instantiate a Model that we'll use to find a matching object (or throw an error if it doesn't exist)
        try {
            $user = User::init($this->app->data->models)
                        ->find([ 'email' => $email_address ]);
        } catch (ModelNotFoundException|EntityModelNotFoundException $exception) {
            return 'Could not find Model';
        }
        
        return $user;
    }
}