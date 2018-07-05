<?php

namespace WANGHORN\Controller\Dev;

use Error;
use Sm\Controller\Controller;
use Sm\Core\Exception\Exception;
use Sm\Core\Exception\InvalidArgumentException;
use Sm\Core\Exception\UnimplementedError;
use Sm\Core\Factory\Exception\FactoryCannotBuildException;
use Sm\Core\Query\Module\Exception\UnfoundQueryModuleException;
use Sm\Core\Sm\Sm;
use Sm\Data\Model\Exception\ModelNotFoundException;
use Sm\Data\Model\ModelPersistenceManager;
use Sm\Data\Model\ModelPropertyMetaSchematic;
use Sm\Data\Model\ModelSchematic;
use Sm\Data\Model\StandardModelPersistenceManager;
use Sm\Data\Property\PropertySchematic;
use Sm\Data\Source\Database\Table\TableSourceSchematic;
use Sm\Modules\Query\MySql\MySqlQueryModule;
use Sm\Modules\Query\Sql\Constraints\ForeignKeyConstraintSchema;
use Sm\Modules\Query\Sql\Constraints\PrimaryKeyConstraintSchema;
use Sm\Modules\Query\Sql\Constraints\UniqueKeyConstraintSchema;
use Sm\Modules\Query\Sql\Data\Column\ColumnSchema;
use Sm\Modules\Query\Sql\Data\Column\DateTimeColumnSchema;
use Sm\Modules\Query\Sql\Data\Column\IntegerColumnSchema;
use Sm\Modules\Query\Sql\Data\Column\VarcharColumnSchema;
use Sm\Modules\Query\Sql\Formatting\SqlQueryFormatterManager;
use Sm\Modules\Query\Sql\SqlDisplayContext;
use Sm\Modules\Query\Sql\Statements\AlterTableStatement;
use Sm\Modules\Query\Sql\Statements\CreateTableStatement;
use Sm\Query\Proxy\String_QueryProxy;
use WANGHORN\Controller\AppController;

class DevController extends AppController {

	private function dieWithQueryError($error) {
		header('Content-Type: application/json');
		$msg = ['error' => $error];
		echo json_encode($msg);
		die();
	}
	public function executeQuery($smID, $queryType) {
		# Should we run the query, or just say the query we want to execute?
		$do_execute = isset(Sm::$globals->get['run']);

		if (!$smID) $this->dieWithQueryError('No smID provided');
		if (!$queryType) $this->dieWithQueryError('No QueryType provided');

		try {
			$modelSchematics = $this->app->data->models->getRegisteredSchematics();
			list($createTableStrings, $createTableStatements, $alterTableStrings, $alterTableStatements) = $this->modelsToQueries($modelSchematics);
			switch ($queryType) {
				case 'CREATE_TABLE':
					$res = ['query' => $createTableStrings[$smID]];
					if ($do_execute) $res['success'] = $this->app->query->interpret($createTableStatements[$smID]);
					break;
				case 'ALTER_TABLE':
					$res = ['queries' => $alterTableStrings[$smID]];
					if ($do_execute) $res['success'] = [];
					foreach (($alterTableStatements[$smID] ?? []) as $query) {
						if ($do_execute) $res['success'][] = $this->app->query->interpret($query);
					}
					break;
				default :
					$this->dieWithQueryError("Cannot execute requested query");
					break;
			}
			return $res;
		} catch (\Exception|InvalidArgumentException|UnimplementedError $e) {
			$this->dieWithQueryError($e->getMessage());
		}
	}

	public function status() {
		try {
			$canConnect__std = $this->app->query->getQueryModule()->canConnect();
		} catch (FactoryCannotBuildException $e) {
			$canConnect__std = false;
		}
		try {
			if ($canConnect__std) {
				$canSelect__std = !!$this->app->query->interpret(String_QueryProxy::init('SELECT "hello";'));
			} else $canSelect__std = false;
		} catch (\Exception $exception) {
			$canSelect__std = false;
		}

		$str           = APP__LOG_PATH . 'example.txt';
		$log_exists    = file_exists(APP__LOG_PATH);
		$can_write_log = boolval(fopen($str, 'a'));
		$can_read_log  = boolval(fopen(APP__LOG_PATH, 'r'));
		return [
			'environment'          => $this->app->getEnv(),
			'database_connections' => [
				'std_mysql' => [
					'status' => [
						'can_connect' => $canConnect__std,
						'can_select'  => $canSelect__std
					]
				],
			],
			'directories'          => [
				'logging' => [
					'status'   => ['exists'         => $log_exists,
					               'can_write'      => $can_write_log,
					               'can_read'       => $can_read_log,
					               'can_delete_log' => $can_write_log && boolval(unlink($str))],
					'contents' => array_values(array_diff(scandir(APP__LOG_PATH), ['..', '.']))
				]
			],
			'session'              => $_SESSION,
		];
	}

	public function entityConfig() {
		$html_filename = APP__CONFIG_PATH . 'entities.json';
		$json          = file_get_contents($html_filename);
		$config        = json_decode($json, 1);
		$config_arr    = [];
		foreach ($config as $id => $item) {
			$config_arr[$item['smID'] ?? $id] = $item;
		}
		return $config_arr;
	}
	public function entities() {
		/** @var \Sm\Data\Entity\EntitySchematic[] $entitySchematics */
		$entitySchematics = $this->app->data->entities->getRegisteredSchematics();
		$entity_configs   = $this->entityConfig();
		$all              = [];
		foreach ($entitySchematics as $entitySchematic) {
			$all[$entitySchematic->getSmID()] = [
				'schematic' => $entitySchematic,
				'config'    => $entity_configs[$entitySchematic->getSmID() ?? ''] ?? [],
			];
		}
		return $all;
	}
	public function models() {

	}

	public function findAll($smID) {
		$modelPersistenceManager = $this->app->data->models->persistenceManager;
		if ($modelPersistenceManager instanceof StandardModelPersistenceManager) {
			$model = $this->app->data->models->instantiate($smID);
			try {
				$all = $modelPersistenceManager->setFindSafety(false)->findAll($model);
			} catch (ModelNotFoundException $exception) {
				return [];
			}
			return $all;
		}
		return null;
	}
	public function proxy(): Controller {
		$proxy      = new DevProxy($this);
		$can_access = isset($_SESSION['IS_DEVELOPER']);
		$proxy->setCanAccess(true);
		return $proxy;
	}

	private function getModelPersistenceManager(): ModelPersistenceManager {
		return $this->app->data->models->persistenceManager;
	}
}