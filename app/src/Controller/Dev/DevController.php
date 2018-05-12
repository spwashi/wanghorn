<?php

namespace WANGHORN\Controller\Dev;

use Error;
use Sm\Application\Application;
use Sm\Controller\Controller;
use Sm\Core\Exception\Exception;
use Sm\Core\Exception\InvalidArgumentException;
use Sm\Core\Exception\UnimplementedError;
use Sm\Core\Factory\Exception\FactoryCannotBuildException;
use Sm\Core\Query\Module\Exception\UnfoundQueryModuleException;
use Sm\Data\Model\Exception\ModelNotFoundException;
use Sm\Data\Model\ModelPersistenceManager;
use Sm\Data\Model\ModelPropertyMetaSchematic;
use Sm\Data\Model\ModelSchematic;
use Sm\Data\Model\StandardModelPersistenceManager;
use Sm\Data\Property\PropertySchematic;
use Sm\Data\Source\Database\Table\TableSourceSchematic;
use Sm\Modules\Network\Http\Request\HttpRequestFromEnvironment;
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
use WANGHORN\Entity\User\User;

class DevController extends AppController {
    protected function propertyToColumn(PropertySchematic $propertySchema, TableSourceSchematic $tableSourceSchematic) {
        $datatypes      = $propertySchema->getRawDataTypes();
        $first_datatype = $datatypes[0] ?? null;
        
        switch ($first_datatype) {
            case 'int':
                $column = $this->_initIntColumn($propertySchema);
                break;
            case 'string':
                $column = $this->_initStringColumn($propertySchema);
                break;
            case 'datetime':
                $column = $this->_initDatetimeColumn($propertySchema);
                break;
            default :
                $propertySchema_json = json_encode(get_object_vars($propertySchema));
                throw new UnimplementedError("Cannot create property for {$first_datatype} yet (for {$propertySchema_json})");
        }
        
        $is_null = in_array('null', $datatypes);
        $column->setTableSchema($tableSourceSchematic);
        $column->setDefault($propertySchema->getDefaultValue());
        $column->setNullability($is_null);
        
        return $column;
    }
    protected function _initIntColumn(PropertySchematic $propertySchema): ColumnSchema {
        $column = IntegerColumnSchema::init();
        $column->setAutoIncrement($propertySchema->isGenerated())
               ->setName($propertySchema->getName())
               ->setLength($propertySchema->getLength() ?? 11);
        return $column;
    }
    protected function _initDatetimeColumn(PropertySchematic $propertySchema): ColumnSchema {
        $column = DateTimeColumnSchema::init();
        $column->setName($propertySchema->getName());
        $column->setOnUpdate($propertySchema->getOnModelUpdateValue());
        return $column;
    }
    protected function _initStringColumn(PropertySchematic $propertySchema): ColumnSchema {
        $column = VarcharColumnSchema::init()
                                     ->setName($propertySchema->getName())
                                     ->setLength($propertySchema->getLength() ?? 25);
        return $column;
    }
    
    protected function dieWithQueryError($error) {
        header('Content-Type: application/json');
        $msg = [ 'error' => $error ];
        echo json_encode($msg);
        die();
    }
    
    /**
     * @throws \Sm\Core\Exception\Exception
     */
    public function executeQuery($smID, $queryType) {
        $do_execute = isset($_GET['run']);
        if (!$smID) $this->dieWithQueryError('No smID provided');
        if (!$queryType) $this->dieWithQueryError('No QueryType provided');
        try {
            $modelSchematics = $this->app->data->models->getRegisteredSchematics();
            list($createTableStrings, $createTableStatements, $alterTableStrings, $alterTableStatements) = $this->modelsToQueries($modelSchematics);
            switch ($queryType) {
                case 'CREATE_TABLE':
                    $res = [ 'query' => $createTableStrings[ $smID ] ];
                    if ($do_execute) $res['success'] = $this->app->query->interpret($createTableStatements[ $smID ]);
                    break;
                case 'ALTER_TABLE':
                    $res = [ 'queries' => $alterTableStrings[ $smID ] ];
                    if ($do_execute) $res['success'] = [];
                    foreach (($alterTableStatements[ $smID ] ?? []) as $query) {
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
            $std_mysql = $this->app->query->getQueryModule()->canConnect();
        } catch (FactoryCannotBuildException $e) {
            $std_mysql = false;
        }
        
        return [
            'database_connections' => [
                'mysql' => [
                    'std' => $std_mysql,
                ],
            ],
        ];
    }
    public function modelConfig() {
        $html_filename = DEFAULT_APP__CONFIG_PATH . 'out/models.json';
        $json          = file_get_contents($html_filename);
        $config        = json_decode($json, 1);
        $config_arr    = [];
        foreach ($config as $id => $item) {
            $config_arr[ $item['smID'] ?? $id ] = $item;
        }
        return $config_arr;
    }
    public function entities() {
        return $this->app->data->entities->getRegisteredSchematics();
    }
    public function models() {
        $fetch = $_GET['fetch'] ?? (isset($_GET['models']) ? 'models' : null);
        
        #   $this->app->query->interpret($query);
        
        $modelDataManager        = $this->app->data->models;
        $modelPersistenceManager = $modelDataManager->persistenceManager;
        $models                  = $modelDataManager->getRegisteredSchematics();
        $model_configs           = $this->modelConfig();
        
        switch ($fetch) {
            case 'config':
                return $model_configs;
            case 'models':
            case 'model':
                return $models;
            case null:
                try {
                    list($createTableStatement_strings, , $alterTableStatement_strings) = $this->modelsToQueries($models);
                } catch (Exception $e) {
                    return $e;
                }
                
                $indices = [
                    'model'                => $models,
                    'config'               => $model_configs,
                    'createTableStatement' => $createTableStatement_strings,
                    'alterTableStatements' => $alterTableStatement_strings,
                ];
                
                $all = [];
                foreach ($indices as $config_index => $model_arr) {
                    foreach ($model_arr as $smID => $config) {
                        $all[ $smID ]                  = $all[ $smID ] ?? [];
                        $all[ $smID ][ $config_index ] = $config;
                        $tableName                     = $modelPersistenceManager->getModelSource($smID)->getName();
                        try {
                            $tableCheck = String_QueryProxy::init("SELECT 1 FROM {$tableName} LIMIT 1;");
                            try {
                                $this->app->query->interpret($tableCheck);
                                $table_exists = true;
                            } catch (\PDOException $e) {
                                $table_exists = false;
                            }
                            $all[ $smID ]['tableExists'] = $table_exists;
                        } catch (FactoryCannotBuildException $e) {
                            return $e;
                        } catch (UnfoundQueryModuleException $e) {
                            return $e;
                        } catch (\Exception $e) {
                            return $e;
                        }
                    }
                }
                
                return $all;
        }
    }
    public function routes() {
        return $this->app->communication->routing->listRoutes();
    }
    public function monitors() {
        return json_decode(json_encode($this->app->getMonitors()), 1);
    }
    /**
     * @param $modelSmID
     *
     * @return \Sm\Data\Model\Model
     * @throws \Sm\Core\Exception\InvalidArgumentException
     * @throws \Sm\Core\Exception\UnimplementedError
     * @throws \Sm\Core\Resolvable\Error\UnresolvableException
     * @throws \Sm\Data\Property\Exception\NonexistentPropertyException
     */
    public function createModel($modelSmID) {
        $data = HttpRequestFromEnvironment::getRequestData();
        /** @var \WANGHORN\Model\Model $model */
        $model      = $this->app->data->models->instantiate($modelSmID);
        $properties = [];
        foreach ($data as $key => $value) {
            $property           = $model->getProperties()->{$key};
            $properties[ $key ] = $property;
            
            if ($this->app->environmentIs(Application::ENV_DEV)) {
                $model->set($key, $value);
            }
        }
        $model->validate();
        $modelPersistenceManager = $this->app->data->models->persistenceManager;
        $newModel                = $modelPersistenceManager->create($model);
        return $newModel;
    }
    public function eg() {
        
        try {
            $Sam = User::init($this->app->data->models)->find([ 'user_id' => 1 ]);
            
            echo "<pre>";
            echo json_encode($Sam, JSON_PRETTY_PRINT);
            echo "</pre>";
        } catch (ModelNotFoundException $e) {
            $previous = $e->getPrevious();
            var_dump($previous);
        }
        
        
        # -- rendering
        
        $vars = [
            'path_to_site' => $this->app->path,
        ];
        try {
            $rendered = $this->app->representation->render('hello.twig', $vars);
        } catch (UnimplementedError $e) {
        }
        
        # -- response
        
        return $rendered;
    }
    /**
     * @param $smID
     *
     * @return null|\Sm\Data\Model\Model[]
     * @throws \Sm\Core\Exception\InvalidArgumentException
     * @throws \Sm\Core\Exception\UnimplementedError
     * @throws \Sm\Core\Resolvable\Error\UnresolvableException
     * @throws \Sm\Data\Property\Exception\NonexistentPropertyException
     */
    public function findAll($smID) {
        $modelPersistenceManager = $this->app->data->models->persistenceManager;
        if ($modelPersistenceManager instanceof StandardModelPersistenceManager) {
            $model = $this->app->data->models->instantiate($smID);
            $all   = $modelPersistenceManager->setFindSafety(false)->findAll($model);
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
    /**
     * @param  \Sm\Data\Model\ModelSchematic[] $models
     *
     * @return array
     * @throws \Error
     * @throws \Sm\Core\Exception\Exception
     */
    protected function modelsToQueries($models): array {
        $createTableStatement_string_arr = [];
        $all_columns                     = [];
        $createTableStatement_arr        = [];
        $tableReferenceArr__array        = [];
        $queryFormatter                  = MySqlQueryModule::init()->initialize()->getQueryFormatter();
        
        foreach ($models as $modelSmID => $model) {
            $tableName = $this->getModelPersistenceManager()->getModelSource($model)->getName();
            if (strpos($tableName, '_') === 0) continue;
            $this->convertPropertiesToColumns($model,
                                              $all_columns,
                                              $tableReferenceArr__array,
                                              $meta,
                                              $columns,
                                              $primaries);
            $createTableStatement                          = $this->createCreateTableStatement($model, $columns, $primaries, $meta, $all_columns);
            $createTableStatement_arr[ $modelSmID ]        = $createTableStatement;
            $createTableStatement_string_arr[ $modelSmID ] = $queryFormatter->format($createTableStatement);
        }
        list($alterTableStatement_string_arr, $alterTableStatement_arr) = $this->createAlterTableStatements($tableReferenceArr__array,
                                                                                                            $all_columns,
                                                                                                            $queryFormatter);
        return [
            $createTableStatement_string_arr,
            $createTableStatement_arr,
            $alterTableStatement_string_arr,
            $alterTableStatement_arr,
        ];
    }
    /**
     * @param array                                                     $tableReference_arr__array
     * @param ColumnSchema[]                                            $all_columns
     * @param \Sm\Modules\Query\Sql\Formatting\SqlQueryFormatterManager $queryFormatter
     *
     * @return array
     * @throws \Sm\Core\Exception\Exception
     */
    protected function createAlterTableStatements(array $tableReference_arr__array,
                                                  array $all_columns,
                                                  SqlQueryFormatterManager $queryFormatter) {
        
        $alterTableStatement_arr        = [];
        $alterTableStatement_string_arr = [];
        foreach ($tableReference_arr__array as $tableName => $_arr_arr) {
            foreach ($_arr_arr as $_arr) {
                /** @var ColumnSchema $_column */
                /** @var ColumnSchema $_referenced_column */
                /** @var ModelSchematic $_modelSchematic */
                $_column                 = $_arr['column'];
                $_modelSchematic         = $_arr['modelSchematic'];
                $_referenced_column_smID = $_arr['referenced_column_smID'];
                $_referenced_column      = $all_columns[ $_referenced_column_smID ] ?? null;
                if (!isset($_referenced_column)) {
                    throw new Exception("Cannot reference " . $_referenced_column_smID);
                }
                
                $constraint_name     = $tableName . '__' . ($_column->getName() ?: '') . '__' . ($_referenced_column->getName() ?: '');
                $alterTableStatement = AlterTableStatement::init($tableName)
                                                          ->withConstraints(ForeignKeyConstraintSchema::init()
                                                                                                      ->setConstraintName($constraint_name)
                                                                                                      ->addColumn($_column)
                                                                                                      ->addRefeferencedColumns($_referenced_column));
                
                $smID = $_modelSchematic->getSmID();
                
                $alterTableStatement_arr[ $smID ]          = $alterTableStatement_arr[ $smID ] ?? [];
                $alterTableStatement_string_arr[ $smID ]   = $alterTableStatement_string_arr[ $smID ] ?? [];
                $alterTableStatement_arr[ $smID ][]        = $alterTableStatement;
                $alterTableStatement_string_arr[ $smID ][] = $queryFormatter->format($alterTableStatement, new SqlDisplayContext);
            }
        }
        
        return [
            $alterTableStatement_string_arr,
            $alterTableStatement_arr,
        ];
    }
    /**
     * @param $modelSchematic
     * @param $all_columns
     * @param $tableReferenceArr__array
     * @param $meta
     * @param $columns
     * @param $primaries
     *
     */
    protected function convertPropertiesToColumns(ModelSchematic $modelSchematic,
                                                  &$all_columns,
                                                  &$tableReferenceArr__array,
                                                  &$meta,
                                                  &$columns,
                                                  &$primaries): void {
        $properties  = $modelSchematic->getProperties();
        $meta        = $modelSchematic->getPropertyMeta();
        $columns     = [];
        $primaries   = [];
        $table_name  = $this->getModelTablename($modelSchematic);
        $tableSchema = TableSourceSchematic::init()->setName($table_name);
        
        /**
         * @var                                     $property_name
         * @var \Sm\Data\Property\PropertySchematic $property
         */
        foreach ($properties as $property_name => $property) {
            try {
                $column                              = $this->propertyToColumn($property, $tableSchema);
                $all_columns[ $property->getSmID() ] = $column;
                if (!$column) continue;
            } catch (Exception $exception) {
                continue;
            }
            
            if ($meta->isPrimary($property)) {
                $primaries[] = $column;
            }
            $columns[]                    = $column;
            $referenceDescriptorSchematic = $property->getReferenceDescriptor();
            if ($referenceDescriptorSchematic) {
                $tableReferenceArr__array[ $table_name ]   = $tableReferenceArr__array[ $table_name ] ?? [];
                $tableReferenceArr__array[ $table_name ][] = [ 'column'                 => $column,
                                                               'modelSchematic'         => $modelSchematic,
                                                               'referenced_column_smID' => $referenceDescriptorSchematic->getHydrationMethod(),
                ];
            }
        }
    }
    /**
     * @param $_unique_keys
     * @param $all_columns
     * @param $createTable
     */
    protected function addUniqueKeyConstraint(array $_unique_keys,
                                              array $all_columns,
                                              CreateTableStatement $createTable): void {
        $constraint = UniqueKeyConstraintSchema::init();
        foreach ($_unique_keys as $_uniquePropertySmID) {
            $column = $all_columns[ $_uniquePropertySmID ] ?? null;
            if (!isset($column)) {
                throw new Error("Could not find column {$_uniquePropertySmID}");
            }
            $constraint->addColumn($column);
        }
        $createTable->withConstraints($constraint);
    }
    /**
     * @param $model
     * @param $columns
     * @param $primaries
     * @param $meta
     * @param $all_columns
     *
     * @return CreateTableStatement
     */
    protected function createCreateTableStatement(ModelSchematic $model, $columns, $primaries, $meta, $all_columns): CreateTableStatement {
        /** @var CreateTableStatement $createTable */
        $table_name  = $this->getModelTablename($model);
        $createTable = CreateTableStatement::init($table_name)->withColumns(...$columns);
        
        if (count($primaries)) {
            $createTable->withConstraints(PrimaryKeyConstraintSchema::init()->addColumn(...$primaries));
        }
        
        # figure out unique keys
        
        /** @var ModelPropertyMetaSchematic $meta */
        $_unique_keys = $meta->getUniqueKeyGroup();
        
        if (!empty($_unique_keys)) {
            $this->addUniqueKeyConstraint($_unique_keys, $all_columns, $createTable);
        }
        
        return $createTable;
    }
    /**
     * @return ModelPersistenceManager
     */
    protected function getModelPersistenceManager(): ModelPersistenceManager {
        return $this->app->data->models->persistenceManager;
    }
    /**
     * @param \Sm\Data\Model\ModelSchematic $model
     *
     * @return null|string
     */
    protected function getModelTablename(ModelSchematic $model) {
        $persistenceManager = $this->getModelPersistenceManager();
        $table_name         = $persistenceManager->getModelSource($model)->getName();
        return $table_name;
    }
}