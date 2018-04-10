<?php

namespace WANGHORN\Controller\Dev;

use Error;
use Sm\Application\Controller\BaseApplicationController;
use Sm\Core\Exception\Exception;
use Sm\Core\Exception\UnimplementedError;
use Sm\Data\Model\Exception\ModelNotFoundException;
use Sm\Data\Model\ModelSchematic;
use Sm\Data\Property\PropertySchematic;
use Sm\Data\Source\Database\Table\TableSourceSchematic;
use Sm\Modules\Sql\Constraints\ForeignKeyConstraintSchema;
use Sm\Modules\Sql\Constraints\PrimaryKeyConstraintSchema;
use Sm\Modules\Sql\Constraints\UniqueKeyConstraintSchema;
use Sm\Modules\Sql\Data\Column\ColumnSchema;
use Sm\Modules\Sql\Data\Column\DateTimeColumnSchema;
use Sm\Modules\Sql\Data\Column\IntegerColumnSchema;
use Sm\Modules\Sql\Data\Column\VarcharColumnSchema;
use Sm\Modules\Sql\Formatting\SqlQueryFormatterManager;
use Sm\Modules\Sql\MySql\Module\MySqlQueryModule;
use Sm\Modules\Sql\Statements\AlterTableStatement;
use Sm\Modules\Sql\Statements\CreateTableStatement;
use WANGHORN\Entity\User\User;

class Dev extends BaseApplicationController {
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
        $column
            ->setAutoIncrement($propertySchema->isGenerated())
            ->setName($propertySchema->getName())
            ->setLength($propertySchema->getLength());
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
    
    public function modelConfig() {
        $html_filename = APP__CONFIG_PATH . 'out/models.json';
        $json          = file_get_contents($html_filename);
        $config        = json_decode($json, 1);
        $config_arr    = [];
        foreach ($config as $id => $item) {
            $config_arr[ $item['smID'] ?? $id ] = $item;
        }
        return $config_arr;
    }
    public function models() {
        #   $this->app->query->interpret($query);
        $models = $this->app->data->models->getRegisteredSchematics();
        
        list(
            $createTableStatement_strings,
            $createTableStatement,
            $alterTableStatement_strings,
            $alterTableStatement
            ) = $this->modelsToQueries($models);
        
        $model_config = $this->modelConfig();
        $indices      = [
            'model'                => $models,
            'config'               => $model_config,
            'createTableStatement' => $createTableStatement_strings,
            'alterTableStatements' => $alterTableStatement_strings,
        ];
        
        $all = [];
        foreach ($indices as $config_index => $model_arr) {
            foreach ($model_arr as $smID => $config) {
                $all[ $smID ]                  = $all[ $smID ] ?? [];
                $all[ $smID ][ $config_index ] = $config;
            }
        }
        
        return $all;
    }
    public function monitors() {
        return json_decode(json_encode($this->app->getMonitors()), 1);
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
        
        $vars     = [
            'path_to_site' => $this->app->path,
        ];
        $rendered = $this->app->representation->render('hello.twig', $vars);
        
        # -- response
        
        return $rendered;
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
     * @param array                                               $tableReference_arr__array
     * @param ColumnSchema[]                                      $all_columns
     * @param \Sm\Modules\Sql\Formatting\SqlQueryFormatterManager $queryFormatter
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
                $alterTableStatement_string_arr[ $smID ][] = $queryFormatter->format($alterTableStatement);
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
        $properties = $modelSchematic->getProperties();
        $meta       = $modelSchematic->getPropertyMeta();
        $columns    = [];
        $primaries  = [];
        /**
         * @var                                     $property_name
         * @var \Sm\Data\Property\PropertySchematic $property
         */
        $modelName   = $modelSchematic->getName();
        $tableSchema = TableSourceSchematic::init()->setName($modelName);
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
                $tableReferenceArr__array[ $modelName ]   = $tableReferenceArr__array[ $modelName ] ?? [];
                $tableReferenceArr__array[ $modelName ][] = [
                    'column'                 => $column,
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
    protected function createCreateTableStatement(ModelSchematic $model,
                                                  $columns,
                                                  $primaries,
                                                  $meta,
                                                  $all_columns): CreateTableStatement {
        /** @var CreateTableStatement $createTable */
        $createTable = CreateTableStatement::init($model->getName())
                                           ->withColumns(...$columns);
        
        if (count($primaries)) {
            $createTable->withConstraints(PrimaryKeyConstraintSchema::init()
                                                                    ->addColumn(...$primaries));
        }
        
        # figure out unique keys
        /** @var  \Sm\Data\Model\ModelPropertyMetaSchematic $meta */
        $_unique_keys = $meta->getUniqueKeyGroup();
        
        if (!empty($_unique_keys)) {
            $this->addUniqueKeyConstraint($_unique_keys, $all_columns, $createTable);
        }
        return $createTable;
    }
}