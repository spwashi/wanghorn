<?php


namespace WANGHORN\Controller\User;


use Sm\Application\Controller\BaseApplicationController;
use Sm\Data\Entity\Exception\EntityModelNotFoundException;
use Sm\Data\Model\Exception\ModelNotFoundException;
use Sm\Modules\Network\Http\Request\HttpRequestFromEnvironment;
use WANGHORN\Controller\User\Login\ResponseStatus;
use WANGHORN\Entity\User\User;

class UserController extends BaseApplicationController {
    public function userByID($id) {
        $Sam = User::init($this->app->data->models)
                   ->find([
                              'email' => $id,
                          ]);
        return $Sam;
    }
    public function signUp() {
        $request_data = HttpRequestFromEnvironment::getRequestData();
        $username     = $request_data['username'] ?? null;
        $password     = $request_data['password'] ?? null;
        $response     = [];
        
        if (!$username) $response['username'] = new ResponseStatus(ResponseStatus::ERROR, 'Username cannot be empty');
        if (!$password) $response['password'] = new ResponseStatus(ResponseStatus::ERROR, 'Password cannot be empty');
        
        if (empty($response['username'] ?? []) && empty($response['password'] ?? [])) {
            return new ResponseStatus(ResponseStatus::SUCCESS,
                                      "Successfully signed up User {$username}",
                                      [
                                          'username' => $username,
                                      ]);
        }
        
        return new ResponseStatus(ResponseStatus::ERROR,
                                  'Could not continue signup',
                                  $response);
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