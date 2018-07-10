<?php

use Sm\Application\Application;
use Sm\Query\Proxy\String_QueryProxy;
require_once __DIR__ . '/../_test_base.php';

const TEST_DB_NAME = 'wanghorn__test';

function resolveApplication(): Application {
	return Application::init(APP__APP_PATH, APP__CONFIG_PATH, APP__LOG_PATH)->boot();
}

function WANGHORN_TEST__BUILD_APP_TABLES(Application $application) {
	return $application->controller->get('Dev|[Model]@executeAll')->resolve();
}
function WANGHORN_TEST__DROP_APP_TABLES(Application $app) {
	$tbl_drop_string = WANGHORN_TEST__GET_DROP_TABLE_STRINGS($app);

	foreach ($tbl_drop_string as $string) $stmts[] = String_QueryProxy::init($string);

	$queries = array_merge([String_QueryProxy::init("SET FOREIGN_KEY_CHECKS=0;")],
	                       $stmts ?? [],
	                       [String_QueryProxy::init("SET FOREIGN_KEY_CHECKS=1;")]);

	$app->query->interpret($queries);
}
function WANGHORN_TEST__GET_DROP_TABLE_STRINGS(Application $app): array {
	$db_name   = TEST_DB_NAME;
	$get_drops = "SELECT concat('DROP TABLE `', table_name, '`;') AS 'stmt' FROM information_schema.tables WHERE table_schema = '{$db_name}';";
	$drops     = $app->query->interpret(String_QueryProxy::init($get_drops));
	$stmts     = [];
	foreach ($drops as $drop_stmt_arr) $stmts[] = $drop_stmt_arr['stmt'];
	return $stmts;
}