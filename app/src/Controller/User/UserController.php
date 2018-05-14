<?php


namespace WANGHORN\Controller\User;


use Sm\Core\Exception\InvalidArgumentException;
use Sm\Data\Entity\Context\EntityContext;
use Sm\Data\Entity\Context\EntityCreationContext;
use Sm\Data\Entity\EntitySchema;
use Sm\Data\Entity\Exception\EntityModelNotFoundException;
use Sm\Modules\Network\Http\Http;
use Sm\Modules\Network\Http\Request\HttpRequestFromEnvironment;
use WANGHORN\Controller\AppController;
use WANGHORN\Entity\User\User;

class UserController extends AppController {
    const SESSION_USERNAME_INDEX = APP__NAME . '_LOGGED_IN_USERNAME_';
    
    /**
     * @param $context_name
     *
     * @return \Sm\Data\Entity\Context\EntityContext
     * @throws \Sm\Core\Exception\InvalidArgumentException
     * @throws \Sm\Core\Exception\UnimplementedError
     */
    public function resolveContext($context_name) {
        /** @var \Sm\Data\Entity\EntityDataManager $entityDataManager */
        $entityDataManager = $this->app->data->entities;
        switch ($context_name) {
            case 'signup_process':
                $entityContext = EntityCreationContext::init('signup_process');
                break;
            default:
                $entityContext = EntityContext::init($context_name);
                break;
        }
        $entityContext = $entityContext->registerSchematicArray([
                                                                    $entityDataManager->getSchematicByName('user'),
                                                                    $entityDataManager->getSchematicByName('password'),
                                                                ]);
        return $entityContext;
    }
    
    /**
     * @param      $context
     * @param      $identity
     *
     * @param bool $throw
     *
     * @return \WANGHORN\Entity\User\User
     * @throws \Sm\Data\Entity\Exception\EntityModelNotFoundException
     * @throws \Sm\Data\Property\Exception\NonexistentPropertyException
     * @throws \Sm\Core\Resolvable\Exception\UnresolvableException
     */
    public function findUser($context, $identity, $throw = false): ?User {
        $context_name = $context instanceof EntityContext ? $context->getContextName() : $context;
        
        if (isset($context_name) && !is_string($context_name)) {
            throw new InvalidArgumentException("Cannot find User in this context");
        }
        if (!is_string($identity)) throw new InvalidArgumentException("Can only search for users by ID or Email");
        try {
            return $this->findInContext($identity, $context_name);
        } catch (EntityModelNotFoundException $exception) {
            if ($throw) throw $exception;
            return null;
        } catch (\Exception $exception) {
            var_dump($exception);
        }
    }
    public function findSessionUser(): ?EntitySchema {
        $username     = $_SESSION[ static::SESSION_USERNAME_INDEX ] ?? '~guest~';
        $userFinder   = $this->app->controller->createControllerResolvable('User\\User@findUser');
        $session_user = $userFinder->resolve(null, $username);
        $userProxy    = $session_user ? $session_user->proxyInContext(new EntityContext) : null;
        return $userProxy;
    }
    public function signUp() {
        $request_data  = HttpRequestFromEnvironment::getRequestData();
        $entityContext = $this->resolveContext('signup_process');
        
        /** @var \Sm\Data\Entity\Entity $user */
        $userSchematic = $this->app->data->entities->getSchematicByName('user');
        $user          = $this->app->data->entities->instantiate($userSchematic);
        $messages      = [];
        try {
            $user->set($request_data);
        } catch (\Exception $exception) {
        
        }
        
        /** @var User $user */
        $response = $user->validate($entityContext);
        if (!$response->isSuccess()) $messages['_message'] = $response;
        $messages = array_merge($messages, $response->getPropertyValidationResults());
        return [
            'user'           => $response->isSuccess() ? $user : null,
            'property_names' => array_keys($user->properties->getAll()),
            'message'        => $messages,
            'success'        => $response->isSuccess(),
        ];
    }
    public function logout() {
        $_SESSION[ static::SESSION_USERNAME_INDEX ] = null;
        return $this->app->communication->dispatch(Http::REDIRECT, $this->app->communication->getRoute('home'));
    }
    /**
     * @return $this|array|\WANGHORN\Entity\User\User
     * @throws \Sm\Core\Exception\UnimplementedError
     * @throws \Sm\Core\Exception\InvalidArgumentException
     * @throws \Sm\Data\Property\Exception\NonexistentPropertyException
     * @throws \Sm\Data\Property\Exception\ReadonlyPropertyException
     * @throws \Sm\Core\Resolvable\Exception\UnresolvableException
     */
    public function login() {
        $data     = HttpRequestFromEnvironment::getRequestData();
        $username = $data['username'] ?? null;
        $password = $data['password'] ?? null;
        
        # Instantiate a Model that we'll use to find a matching object (or throw an error if it doesn't exist)
        try {
            $context                                    = new EntityContext('login_process');
            $userEntity                                 = $this->findInContext($username, $context->getContextName());
            $proxy                                      = $userEntity->proxyInContext($context);
            $_SESSION[ static::SESSION_USERNAME_INDEX ] = $userEntity->properties->username->value;
            
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
    
    /**
     * @param        $username
     *
     * @param string $context_name
     *
     * @return \WANGHORN\Entity\User\User
     * @throws \Sm\Core\Resolvable\Exception\UnresolvableException
     * @throws \Sm\Data\Entity\Exception\EntityModelNotFoundException
     * @throws \Sm\Data\Property\Exception\NonexistentPropertyException
     */
    protected function findInContext($username, string $context_name = null): User {
        /** @var User $userEntity */
        $userEntity = $this->app->data->entities->instantiate('user');
        $context    = $this->resolveContext($context_name);
        $index      = filter_var($username, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        $userEntity->find([ $index => $username ], $context);
        return $userEntity;
    }
}