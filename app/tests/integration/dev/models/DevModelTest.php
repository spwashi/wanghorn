<?php

require_once __DIR__ . '/../../app.php';

class DevModelTest extends \PHPUnit\Framework\TestCase {
	/** @var \Sm\Application\Application $app */
	protected $app;

	##  Logging
	const MODEL_META_LOG__LOCATION     = 'test/models/config/metas';
	const MODEL_DB_SETUP_LOG__LOCATION = 'test/models/database/setup';

	#
	##  Setup
	public function setUp() { $this->app = resolveApplication(); }

	#
	##  Tests
	public function testAllModelMetas() {
		$model_metas = $this->app->controller->get('Dev|[Model]@metas')->resolve();

		$this->app->logging->log($model_metas, static::MODEL_META_LOG__LOCATION);

		$this->expectNotToPerformAssertions();
	}
	public function testCanSetup() {
		# All of these queries should end up being "successful" when run on an empty Database
		$response = $this->app->controller->get('Dev|[Model]@executeAll')->resolve();

		$this->app->logging->log($response, static::MODEL_DB_SETUP_LOG__LOCATION);

		foreach ($response as $result) {
			$success = $result['success'] ?? false;

			if (!$success) echo json_encode($result, JSON_PRETTY_PRINT);

			$this->assertTrue($success);
		}
	}
}