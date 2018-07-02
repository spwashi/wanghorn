<?php

use Sm\Application\Application;
use Sm\Core\Sm\Sm;
use WANGHORN\Response\ApiResponse;

require_once __DIR__ . '/../../app.php';

class UserControllerTest extends \PHPUnit\Framework\TestCase {
	/** @var Application */
	protected $app;

	/**
	 * Sets the superglobals this app will use. Because we are testing this application via the CLI, we want to have fine control over what gets set and where
	 */
	public function initSm() { Sm::$globals->server['REQUEST_METHOD'] = 'POST'; }
	public function setUp() {
		$this->app = resolveApplication();
		$this->initSm();
	}
	public function testCreate() {
		$createUser = $this->app->controller->get('[User]@create');

		/** @var ApiResponse $result__empty */
		$result__empty = $createUser();
		$this->assertInstanceOf(ApiResponse::class, $result__empty);
		$this->assertFalse($result__empty->status); # Should be false because we haven't posted anything


		# Attempt again with a password that is too short
		Sm::$globals->post['properties'] = ['username' => 'spwashi', 'password' => 'boonboonboon'];
		$result__tooShort                = $createUser();

//echo json_encode($result, JSON_PRETTY_PRINT);
		var_dump($result__tooShort);
	}
}
