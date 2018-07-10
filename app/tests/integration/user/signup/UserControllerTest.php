<?php

use Sm\Application\Application;
use Sm\Core\Sm\Sm;
use WANGHORN\Response\ApiResponse;

require_once __DIR__ . '/../../app.php';

class UserControllerTest extends \PHPUnit\Framework\TestCase {
	/** @var Application */
	protected $app;

	public function setUp() { $this->app = resolveApplication(); }
	public function testCreate() {
		Sm::$globals->server['REQUEST_METHOD'] = 'POST';

		$createUser = $this->app->controller->get('[User]@create');

		/** @var ApiResponse $result__empty */
		$result__empty = $createUser();
		$this->assertInstanceOf(ApiResponse::class, $result__empty);
		$this->assertFalse($result__empty->status); # Should be false because we haven't posted anything


		# Attempt again with a normal password
		$username = 'spiget_' . \Sm\Core\Util::generateRandomString(5, \Sm\Core\Util::ALPHA);
		$password = 'boonboonboon';

		Sm::$globals->post['properties'] = ['username' => $username, 'password' => $password];
		$result__okay                    = $createUser();
		$modelPersistenceManager         = $this->app->data->models->persistenceManager;

		##  USER
		$user_model = $this->app->data->models->instantiate('user')->set(['username' => $username]);
		$user_id    = $modelPersistenceManager->find($user_model)->properties->id->value;
		$this->assertInternalType('int', $user_id);

		##  PASSWORD
		$password_model  = $this->app->data->models->instantiate('password')->set(['user_id' => $user_id]);
		$hashed_password = $modelPersistenceManager->find($password_model)->properties->password->value;

		# # # # should be hashed and pass verification
		$this->assertNotEquals($hashed_password, $password);
		$this->assertTrue(password_verify($password, $hashed_password));

		echo json_encode($result__okay, JSON_PRETTY_PRINT);
//		var_dump($result__okay);
	}
	public function testLogin() {
		Sm::$globals->server['REQUEST_METHOD'] = 'POST';
		$login_user                            = $this->app->controller->get('[User]@login');
		Sm::$globals->post['username']         = 'spiget--' . \Sm\Core\Util::generateRandomString(5);
		Sm::$globals->post['password']         = 'boonboonboon';
		$response                              = $login_user();
		var_dump($response);
	}
}
