<?php


namespace WANGHORN\Controller\User;


use Modules\Query\Sql\Exception\CannotDuplicateEntryException;
use Sm\Core\Exception\InvalidArgumentException;
use Sm\Data\Entity\Context\EntityContext;
use Sm\Data\Entity\Context\EntityCreationContext;
use Sm\Data\Entity\EntitySchema;
use Sm\Data\Entity\Exception\EntityNotFoundException;
use Sm\Data\Entity\Exception\Persistence\CannotCreateEntityException;
use Sm\Modules\Network\Http\Request\HttpRequestFromEnvironment;
use WANGHORN\Controller\ApiResponse;
use WANGHORN\Controller\AppController;
use WANGHORN\Entity\User\Schema\UserEntitySchema;
use WANGHORN\Entity\User\User;

/**
 * Class UserController
 *
 */
class UserController extends AppController {
    const SESSION_USERNAME_INDEX = APP__NAME . '_LOGGED_IN_USERNAME_';
    
    public function init_entity(): User {
        return $this->app->data->entities->instantiate('user');
    }
    
    #
    ##  Internal Controller Methods
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
    public function findUser($context, $identity, $throw = false): ?User {
        $context_name = $context instanceof EntityContext ? $context->getContextName() : $context;
        
        if (isset($context_name) && !is_string($context_name)) {
            throw new InvalidArgumentException("Cannot find User in this context");
        }
        if (!is_string($identity)) throw new InvalidArgumentException("Can only search for users by ID or Email");
        try {
            return $this->find_inContext($identity, $context_name);
        } catch (EntityNotFoundException|\Exception $exception) {
            if ($throw) throw $exception;
            return null;
        }
    }
    public function findSessionUser(): ?EntitySchema {
        $username     = $_SESSION[ static::SESSION_USERNAME_INDEX ] ?? '~guest~';
        $userFinder   = $this->app->controller->createControllerResolvable('User\\User@findUser');
        $session_user = $userFinder->resolve(null, $username);
        $userProxy    = $session_user ? $session_user->proxyInContext(new EntityContext) : null;
        return $userProxy;
    }
    
    #
    ##  API Methods
    public function create() { return $this->signUp(); }
    public function signUp() {
        /** @var User $user */
        
        $request_data  = HttpRequestFromEnvironment::getRequestData();
        $entityContext = $this->resolveContext('signup_process');
        $properties    = $request_data['properties'] ?? [];
        
        #
        ##  Should probably proxy in contexts
        $user = $this->init_entity()->set($properties);
        
        try {
            $user->find([ 'username' => $user->properties->username ]);
            return new ApiResponse(false, 'User already exists');
        } catch (EntityNotFoundException $exception) {
        }
        
        /** @var \Sm\Data\Entity\Validation\EntityValidationResult $response */
        try {
            $user->create($entityContext);
            
            $username = $user->properties->username;
            $raw_pw   = $user->properties->password->resolve();
            
            return $this->attemptUserLogin($username, $raw_pw);
        } catch (CannotDuplicateEntryException $error) {
            return new ApiResponse(false, 'User already exists');
        } catch (CannotCreateEntityException $exception) {
            $failedProperties     = $exception->getFailedProperties();
            $messages             = $failedProperties;
            $messages['_message'] = 'Could not continue';
        }
        
        $success = empty($failedProperties);
        
        return new ApiResponse($success, $messages);
    }
    public function login() {
        $data = HttpRequestFromEnvironment::getRequestData();
        
        return $this->attemptUserLogin($data['username'] ?? null,
                                       $data['password'] ?? null);
    }
    public function logout() {
        $_SESSION[ static::SESSION_USERNAME_INDEX ] = null;
        return $this->redirect('home');
    }
    protected function proxy_in_context($username, EntityContext $context): UserEntitySchema {
        return $this->find_inContext($username, $context)->proxyInContext($context);
    }
    protected function find_inContext($username, $context_name = null): User {
        if ($context_name instanceof EntityContext) {
            $context_name = $context_name->getContextName();
        }
        
        if (isset($context_name) && !is_string($context_name)) throw new InvalidArgumentException("Cannot find entities within contexts that aren't strings ");
        
        /** @var User $userEntity */
        $userEntity = $this->init_entity();
        $context    = $this->resolveContext($context_name);
        $index      = filter_var($username, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        $userEntity->find([ $index => $username ], $context);
        return $userEntity;
    }
    protected function attemptUserLogin($username, $password): array {
        # Instantiate a Model that we'll use to find a matching object (or throw an error if it doesn't exist)
        try {
            $context = new EntityContext('login_process');
            $user    = $this->proxy_in_context($username, $context);
            $success = $user->findPassword()->value->matches($password);
            
            if (!$success) throw new EntityNotFoundException("Could not find password");
            
            $_SESSION[ static::SESSION_USERNAME_INDEX ] = $user->properties->username->value;
            
            return [
                'user'    => $success ? $user : null,
                'success' => $success,
            ];
        } catch (EntityNotFoundException $exception) {
            return [
                'error'   => 'Could not find User with the provided username and password',
                'success' => false,
            ];
        }
    }
    
    #
    ## API responses
    public function getUserAlreadyExistsStatusResponse() {
        return new ApiResponse(false, 'User Already Exists');
    }
    
}