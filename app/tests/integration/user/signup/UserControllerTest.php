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


		# Attempt again with a password that is too short
		Sm::$globals->post['properties'] = ['username' => 'spiget', 'password' => 'boonboonboon'];
		$result__tooShort                = $createUser();

//echo json_encode($result, JSON_PRETTY_PRINT);
		var_dump($result__tooShort);
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
