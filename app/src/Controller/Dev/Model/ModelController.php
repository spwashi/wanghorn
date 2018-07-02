<?php

namespace WANGHORN\Controller\Dev\Model;


use Sm\Core\Exception\Exception;
use Sm\Core\Factory\Exception\FactoryCannotBuildException;
use Sm\Core\Query\Module\Exception\UnfoundQueryModuleException;
use Sm\Core\Sm\Sm;
use Sm\Query\Proxy\String_QueryProxy;
use WANGHORN\Controller\Dev\DevController;
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
				$models_as_queries      = $convertModelsToQueries($models);
				$_configs               = array_map(function ($config) { return ['config' => $config]; }, $model_configs);
				$_schematics            = array_map(function ($schematic) { return ['schematic' => $schematic]; }, $models);
				$all                    = array_merge_recursive($_schematics, $_configs, $models_as_queries);
				$this->addTableExistence($all);
				return $all;
		}
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