<?php

namespace WANGHORN\Controller\Dev\Model;


use Sm\Core\Exception\Exception;
use Sm\Core\Factory\Exception\FactoryCannotBuildException;
use Sm\Core\Query\Module\Exception\UnfoundQueryModuleException;
use Sm\Core\Sm\Sm;
use Sm\Modules\Query\MySql\MySqlQueryModule;
use Sm\Modules\Query\Sql\SqlDisplayContext;
use Sm\Query\Proxy\String_QueryProxy;
use WANGHORN\Controller\Dev\DevController;
use WANGHORN\Controller\Dev\Query\Model\QueryController;
class ModelController extends DevController {
	public function config() {
		$html_filename = APP__CONFIG_PATH . 'out/models.json';
		$json          = file_get_contents($html_filename);
		$config        = json_decode($json, 1);
		$config_arr    = [];
		foreach ($config as $id => $item) {
			$config_arr[$item['smID'] ?? $id] = $item;
		}
		return $config_arr;
	}
	public function metas() {
		$fetch = Sm::$globals->get['fetch'] ?? (isset(Sm::$globals->get['models']) ? 'models' : null);

		#   $this->app->query->interpret($query);

		$modelDataManager        = $this->app->data->models;
		$modelPersistenceManager = $modelDataManager->persistenceManager;
		$models                  = $this->app->data->models->getRegisteredSchematics();
		$model_configs           = $this->config();

		switch ($fetch) {
			case 'config':
				return $model_configs;
			case 'models':
			case 'model':
				return $models;
			case null:
			default:
				$convertModelsToQueries = $this->app->controller->get('Dev\\Query\\Model\\Query@queries');
				$models_as_queries      = $convertModelsToQueries(QueryController::ONLY_STRING);
				$_configs               = array_map(function ($config) { return ['config' => $config]; }, $model_configs);
				$_schematics            = array_map(function ($schematic) { return ['schematic' => $schematic]; }, $models);
				$all                    = array_merge_recursive($_schematics, $_configs, $models_as_queries);
				$this->addTableExistence($all);
				return $all;
		}
	}
	public function executeAll() {
		$convertModelsToQueries = $this->app->controller->get('Dev\\Query\\Model\\Query@queries');
		$models_as_queries      = $convertModelsToQueries(QueryController::ONLY_QUERY);
		$execution_queue_1      = [];
		$execution_queue_2      = [];
		foreach ($models_as_queries as $smID => $queries) {
			if (isset($queries['create_table'])) {
				$execution_queue_1[] = $queries['create_table'];
			}

			if (isset($queries['alter_table'])) {
				array_push($execution_queue_2, ...$queries['alter_table']);
			}
		}
		$all_queries = array_merge($execution_queue_1, $execution_queue_2);

		$all_results      = [];
		$formatterManager = MySqlQueryModule::init()->initialize()->getQueryFormatter();
		foreach ($all_queries as $query) {
			try {
				$this->app->query->interpret($query);
				$all_results[] = [
					'success' => true,
					'query'   => $formatterManager->format($query, new SqlDisplayContext)
				];
			} catch (\Throwable $exception) {
				$all_results[] = [
					'success' => false,
					'message' => $exception->getMessage(),
					'query'   => $formatterManager->format($query, new SqlDisplayContext)
				];
			}
		}

		return $all_results;
	}
	public function getSchematic($smID) {
		return $this->app->data->models->getSchematicByName($smID);
	}
	protected function addTableExistence(&$all): array {
		foreach ($all as $smID => &$conf_arr) {
			$tableName = $this->app->data->models->persistenceManager->getModelSource($smID)->getName();
			try {
				$tableCheck = String_QueryProxy::init("SELECT 1 FROM {$tableName} LIMIT 1;");
				$this->app->query->interpret($tableCheck);
				$table_exists = true;
			} catch (\PDOException $e) {
				$table_exists = false;
			}
			$conf_arr['tableExists'] = $table_exists;
		}
		return $all;
	}
}