<?php

require_once __DIR__ . '/../../app.php';

class DevModelTest extends \PHPUnit\Framework\TestCase {
	/** @var \Sm\Application\Application $app */
	protected $app;

	##  Logging
	const META_LOG_LOCATION   = 'test/models/metas';
	const CONFIG_LOG_LOCATION = 'test/models/config';

	#
	##  Setup
	public function setUp() { $this->app = resolveApplication(); }

	#
	##  Tests
	public function testAllModelMetas() {
		$model_metas = $this->app->controller->get('Dev|[Model]@metas')->resolve();

		$this->app->logging->log($model_metas, static::META_LOG_LOCATION);

		$this->expectNotToPerformAssertions();
	}
	public function testCanCreate() {
		$response = $this->app->controller->get('Dev|[Model]@executeAll')->resolve();
		$this->app->logging->log($response, static::CONFIG_LOG_LOCATION);
		$this->expectNotToPerformAssertions();
	}
}