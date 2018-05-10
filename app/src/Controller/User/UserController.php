<?php


namespace WANGHORN\Controller\User;


use Sm\Application\Controller\BaseApplicationController;
use Sm\Data\Entity\EntityContext;
use Sm\Data\Entity\Exception\EntityModelNotFoundException;
use Sm\Modules\Network\Http\Request\HttpRequestFromEnvironment;
use WANGHORN\Controller\User\Login\ResponseStatus;
use WANGHORN\Entity\User\User;

class UserController extends BaseApplicationController {
    /**
     * @param $context_name
     *
     * @throws \Sm\Core\Exception\InvalidArgumentException
     * @throws \Sm\Core\Exception\UnimplementedError
     */
    public function resolveContext($context_name) {
        /** @var \Sm\Data\Entity\EntityDataManager $entityDataManager */
        $entityDataManager = $this->app->data->entities;
        $entityContext     = EntityContext::init($context_name)
                                          ->registerSchematicArray([
                                                                       $entityDataManager->getSchematicByName('user'),
                                                                       $entityDataManager->getSchematicByName('password'),
                                                                   ]);
        return $entityContext;
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
     * @throws \Sm\Data\Property\Exception\NonexistentPropertyException
     * @throws \Sm\Data\Property\Exception\ReadonlyPropertyException
     */
    public function login() {
        $data     = HttpRequestFromEnvironment::getRequestData();
        $username = $data['username'] ?? null;
        $password = $data['password'] ?? null;
        
        $entityDataManager = $this->app->data->entities;
        
        # Instantiate a Model that we'll use to find a matching object (or throw an error if it doesn't exist)
        try {
            /** @var User $userEntity */
            $userEntity = $entityDataManager->instantiate('user');
            $context    = $this->resolveContext('login_process');
            $index      = filter_var($username, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
            $proxy      = $userEntity->find([ $index => $username ], $context)
                                     ->proxyInContext($context);
            
            $_SESSION['IS_USER_AUTHENTICATED'] = true;
            
            return [
                'user'    => $proxy,
                'success' => true,
            ];
        } catch (EntityModelNotFoundException $exception) {
            return [
                'error'   => 'Could not find User with the provided username and password',
                'success' => false,
            ];
        }
    }
}