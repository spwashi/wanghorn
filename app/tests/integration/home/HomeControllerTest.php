<?php


require_once __DIR__ . '/../app.php';
class HomeControllerTest extends \PHPUnit\Framework\TestCase {
	/** @var \Sm\Application\Application */
	public static $app;
	#
	##  Setup
	public static function setUpBeforeClass() {
		static::$app = resolveApplication();
		WANGHORN_TEST__DROP_APP_TABLES(static::$app);
		WANGHORN_TEST__BUILD_APP_TABLES(static::$app);
	}

	#
	## Tests

	# Doesn't actually check the JavaScript, only verifies that no exceptions are thrown in the process
	public function testCanServeIndex() {
		$this->addToAssertionCount(1);
		$session_user = static::$app->controller->get('[User]@findSessionUser')->resolve();

		static::$app->controller->get('[Home]@index')->resolve();
		var_dump($session_user);


	}
}