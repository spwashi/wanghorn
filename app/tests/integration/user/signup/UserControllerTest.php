<?php
/**
 * Created by PhpStorm.
 * User: sam
 * Date: 6/29/18
 * Time: 2:24 PM
 */

use Sm\Application\Application;
use WANGHORN\Controller\User\UserController;
class UserControllerTest extends \PHPUnit\Framework\TestCase {
	/** @var Application */
	protected $app;
	public function setUp() {
		@session_start();
		require_once __DIR__ . '/../../../../_base.php';
		$app = Application::init(APP__APP_PATH, APP__CONFIG_PATH, APP__LOG_PATH);
		$app->boot();
		$this->app = $app;
	}
	public function testCreate() {
		$this->app->controller->createControllerResolvable('User\\User@create')->resolve();
	}
}
