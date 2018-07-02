<?php


namespace WANGHORN\Controller\User;


use Modules\Query\Sql\Exception\CannotDuplicateEntryException;
use Sm\Core\Exception\InvalidArgumentException;
use Sm\Core\Resolvable\Exception\UnresolvableException;
use Sm\Core\Resolvable\Resolvable;
use Sm\Data\Entity\Context\EntityContext;
use Sm\Data\Entity\Context\EntityCreationContext;
use Sm\Data\Entity\EntitySchema;
use Sm\Data\Entity\Exception\EntityNotFoundException;
use Sm\Data\Entity\Exception\Persistence\CannotModifyEntityException;
use Sm\Data\Model\Exception\ModelNotFoundException;
use Sm\Data\Property\Property;
use Sm\Logging\LoggingLayer;
use Sm\Modules\Network\Http\Request\HttpRequestFromEnvironment;
use WANGHORN\Entity\User\Verification\Context\UserVerificationContext;
use WANGHORN\Entity\User\Verification\Proxy\UserVerificationProxy;
use WANGHORN\Entity\User\Verification\UserVerification;
use WANGHORN\Response\ApiResponse;
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
			case '::verification':
				$entityContext = UserVerificationContext::init();
				break;
			default:
				$entityContext = parent::resolveContext($context_name);
				break;
		}
		$entityContext = $entityContext->registerSchematicArray([
			                                                        $entityDataManager->getSchematicByName('user'),
			                                                        $entityDataManager->getSchematicByName('password'),
		                                                        ]);
		return $entityContext;
	}
	public function findUser($identity, $context, $throw = false): ?User {
		$context_name = $context instanceof EntityContext ? $context->getContextName() : $context;

		if (isset($context_name) && !is_string($context_name)) {
			throw new InvalidArgumentException("Cannot find User in this context");
		}
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
		$session_user = $userFinder->resolve($username, null);
		$userProxy    = $session_user ? $session_user->proxyInContext($this->resolveContext()) : null;
		return $userProxy;
	}

	#
	##  API Methods
	public function create() { return $this->signUp(); }
	public function signUp() {
		$entityContext = $this->resolveContext('signup_process');
		$properties    = $this->requestData['properties'] ?? [];;

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
		} catch (CannotModifyEntityException $exception) {
			$failedProperties     = $exception->getFailedProperties();
			$messages             = $failedProperties;
			$messages['_message'] = 'Could not continue';
		}

		$success = empty($failedProperties);
		return new ApiResponse($success, $messages);
	}
	public function login() {
		return $this->attemptUserLogin($this->requestData['username'] ?? null, $this->requestData['password'] ?? null);
	}
	public function logout() {
		$_SESSION[static::SESSION_USERNAME_INDEX] = null;
		return $this->redirect('home');
	}
	/**
	 * This logic should /probably/ move out of here
	 *
	 * @param $hash
	 * @return ApiResponse|UserVerificationProxy
	 * @throws InvalidArgumentException
	 * @throws \Sm\Data\Property\Exception\NonexistentPropertyException
	 */
	public function verifyUser($hash) {
		$verificationContext = $this->resolveContext('::verification');
		try {
			/** @var UserVerification $verification */
			$verification = $this->app->data->entities->instantiate('verification');
			$verification->find(['hash' => $hash], $verificationContext);
		} catch (EntityNotFoundException $exception) {
			return new ApiResponse(false, 'Invalid verification link.');
		}

		/** @var \DateTime $link_creation_dt */
		$verificationModel = $verification->getPersistedIdentity();
		$user_id           = $verificationModel->properties->user_id->resolve();
		try {
			# We can only use this link for unverified users
			$user = $this->findUser(['id' => $user_id, 'verification_dt' => null], $verificationContext, true);

			/** @var Model $userModel */
			$userModel = $user->getPersistedIdentity();
			$userModel->set(['verification_dt' => new \DateTime]);
			$this->app->data->models->persistenceManager->save($userModel);

			$this->declareUserLoggedIn($user);
			$this->redirect('home');
		} catch (EntityNotFoundException $exception) {
			return new ApiResponse(false, 'Could not verify user.');
		}

		return $verification->proxyInContext($verificationContext);
	}
	#
	##  Contextualization
	/**
	 * Proxy a new user in a context
	 *
	 * @param                                       $username
	 * @param \Sm\Data\Entity\Context\EntityContext $context
	 *
	 * @return UserEntitySchema
	 * @throws InvalidArgumentException
	 * @throws UnresolvableException
	 */
	protected function proxy_in_context($username, EntityContext $context) {
		return $this->find_in_context($username, $context)->proxyInContext($context);
	}
	protected function find_in_context($identity, $context_name = null): User {
		if ($context_name instanceof EntityContext) {
			$context_name = $context_name->getContextName();
		}

		if (isset($context_name) && !is_string($context_name)) throw new InvalidArgumentException("Cannot find entities within contexts that aren't strings ");

		/** @var User $userEntity */
		$userEntity = $this->init_entity();
		$context    = $this->resolveContext($context_name);

		if (is_string($identity) || $identity instanceof Resolvable) {
			$index      = filter_var("{$identity}", FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
			$attributes = [$index => $identity];
		} else if (is_array($identity)) {
			$attributes = $identity;
		} else {
			throw new UnresolvableException("Could not resolve username");
		}

		$userEntity->find($attributes, $context);
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

			$this->declareUserLoggedIn($user);

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
	##  Sign-up Helpers
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
		ob_start();
		$this->controller('Email\\Email@sendEmail')
		     ->resolve($subject,
		               $html,
		               $plain_text,
		               $from,
		               $recipients);
		ob_end_clean();
	}
	/**
	 * @param $user
	 * @return mixed
	 */
	protected function declareUserLoggedIn($user) {
		return $_SESSION[static::SESSION_USERNAME_INDEX] = $user->properties->username->value;
	}

}