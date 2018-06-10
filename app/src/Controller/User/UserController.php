<?php


namespace WANGHORN\Controller\User;


use Modules\Query\Sql\Exception\CannotDuplicateEntryException;
use Sm\Core\Exception\InvalidArgumentException;
use Sm\Data\Entity\Context\EntityContext;
use Sm\Data\Entity\Context\EntityCreationContext;
use Sm\Data\Entity\EntitySchema;
use Sm\Data\Entity\Exception\EntityNotFoundException;
use Sm\Data\Entity\Exception\Persistence\CannotCreateEntityException;
use Sm\Data\Model\Exception\ModelNotFoundException;
use Sm\Modules\Network\Http\Request\HttpRequestFromEnvironment;
use WANGHORN\Controller\ApiResponse;
use WANGHORN\Controller\AppController;
use WANGHORN\Entity\User\Schema\UserEntitySchema;
use WANGHORN\Entity\User\User;
use WANGHORN\Model\Model;

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
	public function resolveContext($context_name = null) {
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
			return $this->find_in_context($identity, $context_name);
		} catch (EntityNotFoundException|\Exception $exception) {
			if ($throw) throw $exception;
			return null;
		}
	}

	public function findSessionUser(): ?EntitySchema {
		$username     = $_SESSION[static::SESSION_USERNAME_INDEX] ?? '~guest~';
		$userFinder   = $this->app->controller->createControllerResolvable('User\\User@findUser');
		$session_user = $userFinder->resolve(null, $username);
		$userProxy    = $session_user ? $session_user->proxyInContext($this->resolveContext()) : null;
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

		# If the user exists, don't continue
		try {
			#todo should check email addresses
			$user->find(['username' => $user->properties->username]);
			return new ApiResponse(false, 'User already exists');
		} catch (EntityNotFoundException $exception) {
		}


		/** @var \Sm\Data\Entity\Validation\EntityValidationResult $response */
		try {
			$user->create($entityContext);

			$username       = $user->properties->username;
			$login_response = $this->attemptUserLogin($username, $user->properties->password->resolve());

			$this->sendVerificationEmail($user);

			return $login_response;
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
		$_SESSION[static::SESSION_USERNAME_INDEX] = null;
		return $this->redirect('home');
	}

	#
	##  Contextualization
	/**
	 * Proxy a new user in a context in a context
	 *
	 * @param                                       $username
	 * @param \Sm\Data\Entity\Context\EntityContext $context
	 *
	 * @return UserEntitySchema
	 */
	protected function proxy_in_context($username, EntityContext $context) {
		return $this->find_in_context($username, $context)->proxyInContext($context);
	}

	protected function find_in_context($username, $context_name = null): User {
		if ($context_name instanceof EntityContext) {
			$context_name = $context_name->getContextName();
		}

		if (isset($context_name) && !is_string($context_name)) throw new InvalidArgumentException("Cannot find entities within contexts that aren't strings ");

		/** @var User $userEntity */
		$userEntity = $this->init_entity();
		$context    = $this->resolveContext($context_name);
		$index      = filter_var($username, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
		$userEntity->find([$index => $username], $context);
		return $userEntity;
	}

	#
	##  Login Helpers
	protected function attemptUserLogin($username, $password): ApiResponse {
		# Instantiate a Model that we'll use to find a matching object (or throw an error if it doesn't exist)
		try {
			$context = $this->resolveContext('login_process');
			$user    = $this->proxy_in_context($username, $context);
			$success = $user->findPassword()->value->matches($password);

			if (!$success) throw new EntityNotFoundException("Could not find password");

			$_SESSION[static::SESSION_USERNAME_INDEX] = $user->properties->username->value;

			return new ApiResponse(true,
			                       [
				                       '_message' => 'Successfully logged in user',
				                       'user'     => $user->proxyInContext(null)
			                       ],
			                       ['follow' => $this->routeAsLink('home')]);
		} catch (EntityNotFoundException $exception) {
			return new ApiResponse(false, 'Could not log in with the provided username and password');
		}
	}

	#
	##  Signup Helpers
	protected function createVerificationLink($hash): string {
		$parameters = ['hash' => $hash];
		$route_name = 'user--verify';
		return $this->routeAsLink($route_name, $parameters);
	}
	#
	## API responses
	public function getUserAlreadyExistsStatusResponse() {
		return new ApiResponse(false, 'User Already Exists');
	}

	/**
	 * @param $username_str
	 * @param $verification_link
	 * @return string
	 */
	protected function createUserVerificationEmailHTML($username_str, $verification_link): string {
		$html = "Hi, {$username_str}! Thanks for signing up. <br>Please " .
		        "<a href='{$verification_link}'>Click Here to verify your account</a>, and then we can get things set up.";
		return $html;
	}

	public function verifyUser($hash) {
		/** @var Model $schematic */
		$model                   = $this->app->data->models->instantiate('user_verification_hash');
		$model->properties->hash = $hash;
		try {
			$this->app->data->models->persistenceManager->find($model);
		} catch (ModelNotFoundException $exception) {
			return new ApiResponse(false, 'Invalid verification link.');
		}
		return new ApiResponse(true, 'Valid Verification link, but we will not do anything');
	}

	/**
	 * @param $user
	 */
	protected function sendVerificationEmail(UserEntitySchema $user) {
		#todo input validation?
		$username          = $user->properties->username;
		$verification_hash = $user->properties->verification;
		$email             = $user->properties->email;

		# I think these'll throw exceptions if they can't be resolved, but that's also a todo
		$verification_hash_str = $verification_hash->resolve();
		$username_str          = $username->resolve();
		$email_str             = $email->resolve();

		$from    = ['support@spwashi.com', 'Spwashi Support Team'];
		$subject = 'Hello, ' . $username_str . '! Please verify your account';

		$verification_link = $this->createVerificationLink($verification_hash_str);
		$html              = $this->createUserVerificationEmailHTML($username_str, $verification_link);
		$plain_text        = 'Welcome!! Your account is almost set up, but we just need to verify it.';
		$recipients        = [[$email_str, $username_str]];


		#todo better error handling
		$this->controller('Email\\Email@sendEmail')
		     ->resolve($subject,
		               $html,
		               $plain_text,
		               $from,
		               $recipients);
	}

}