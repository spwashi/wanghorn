<?php


require_once __DIR__ . '/../app.php';
class HomeControllerTest extends \PHPUnit\Framework\TestCase {
	public static $app;
	#
	##  Setup
	public static function setUpBeforeClass() {
		static::$app = resolveApplication();
		WANGHORN_TEST__DROP_APP_TABLES(static::$app);
	}

	#
	## Tests
	public function testCanServeIndex() {
		$this->addToAssertionCount(1);


		# Doesn't actually check the JavaScript, only verifies that no exceptions are thrown in the process
		static::$app
			->controller
			->get('[Home]@index')
			->resolve();
	}
}