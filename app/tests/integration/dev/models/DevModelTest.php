<?php

use Sm\Query\Proxy\String_QueryProxy;
require_once __DIR__ . '/../../app.php';

class DevModelTest extends \PHPUnit\Framework\TestCase {
	/** @var \Sm\Application\Application $app */
	protected static $app;
	protected static $TESTING_DATABASE_NAME = 'wanghorn__test';


	##  Logging
	const MODEL_META_LOG__LOCATION     = 'models/config/metas';
	const MODEL_DB_SETUP_LOG__LOCATION = 'models/database/setup';

	#
	##  Setup
	public static function setUpBeforeClass() {
		static::$app = resolveApplication();
	}

	#
	##  Tests
	public function testDropAllTables(): void {
		WANGHORN_TEST__DROP_APP_TABLES(static::$app);
		$this->assertEmpty(WANGHORN_TEST__GET_DROP_TABLE_STRINGS(static::$app));
	}
	public function testAllModelMetas() {
		$model_metas = static::$app->controller->get('Dev|[Model]@metas')->resolve();

		static::$app->logging->log($model_metas, static::MODEL_META_LOG__LOCATION);

		$this->expectNotToPerformAssertions();
	}
	public function testCanSetup() {
		# All of these queries should end up being "successful" when run on an empty Database
		$response = WANGHORN_TEST__BUILD_APP_TABLES(static::$app);
		static::$app->logging->log($response, static::MODEL_DB_SETUP_LOG__LOCATION);
		foreach ($response as $result) {
			$success = $result['success'] ?? false;
			if (!$success) echo json_encode($result, JSON_PRETTY_PRINT);
			$this->assertTrue($success);
		}
	}


	#
	##  Helpers
}