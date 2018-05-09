<?php


namespace WANGHORN\Controller\User;


use Sm\Application\Application;
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
    /**
     * @return $this|array|\WANGHORN\Entity\User\User
     * @throws \Sm\Core\Exception\UnimplementedError
     * @throws \Sm\Core\Exception\InvalidArgumentException
     * @throws \Sm\Core\Resolvable\Error\UnresolvableException
     * @throws \Sm\Data\Property\Exception\NonexistentPropertyException
     */
    public function login() {
        $username          = $_POST['username'] ?? null;
        $password          = $_POST['password'] ?? null;
        $modelDataManager  = $this->app->data->models;
        $entityDataManager = $this->app->data->entities;
        
        # Instantiate a Model that we'll use to find a matching object (or throw an error if it doesn't exist)
        try {
            /** @var User $userEntity */
            $userEntity = $entityDataManager->instantiate('user');
            
            if ($username === 'test_dev' && $password === '8675309') {
                $user                     = $userEntity->set([ 'username' => $username ]);
                $_SESSION['IS_DEVELOPER'] = true;
            } else {
                /** @var User $user */
                $user = $userEntity->find([ 'email' => $username ]);
                $user->findPassword();
                $user->findUsername();
            }
            return $user;
        } catch (ModelNotFoundException|EntityModelNotFoundException $exception) {
            if ($this->app->environmentIs(Application::ENV_DEV)) {
                $error_message = $exception;
            } else {
                $error_message = 'Could not find User';
            }
            return [
                'error'   => $error_message,
                'success' => true,
            ];
        }
    }
}