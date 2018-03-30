<?php

namespace WANGHORN\Controller\Dev;

use Error;
use Sm\Application\Controller\BaseApplicationController;
use Sm\Core\Exception\Exception;
use Sm\Core\Exception\UnimplementedError;
use Sm\Data\Model\Exception\ModelNotFoundException;
use Sm\Data\Property\PropertySchematic;
use Sm\Modules\Sql\Constraints\PrimaryKeyConstraintSchema;
use Sm\Modules\Sql\Constraints\UniqueKeyConstraintSchema;
use Sm\Modules\Sql\Data\Column\ColumnSchema;
use Sm\Modules\Sql\Data\Column\DateTimeColumnSchema;
use Sm\Modules\Sql\Data\Column\IntegerColumnSchema;
use Sm\Modules\Sql\Data\Column\VarcharColumnSchema;
use Sm\Modules\Sql\MySql\Module\MySqlQueryModule;
use Sm\Modules\Sql\Statements\CreateTableStatement;
use WANGHORN\Entity\User\User;

class Dev extends BaseApplicationController {
    protected function propertyToColumn(PropertySchematic $propertySchema) {
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
    
    public function modelsToTables() {
        #   $this->app->query->interpret($query);
        $models = $this->app->data->models->getRegisteredSchematics();
        
        list($formattedQueries, $queries) = $this->formatModels($models);
        
        return [
            'models'           => $models,
            'formattedQueries' => $formattedQueries,
        ];
    }
    public function monitors() {
        return json_decode(json_encode($this->app->getMonitors()), 1);
    }
    public function eg() {
        
        try {
            $Sam = User::init($this->app->data->models)
                       ->find([ 'user_id' => 1 ]);
            
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
     */
    protected function formatModels($models): array {
        $formattedQueries          = [];
        $queries                   = [];
        $_allColumns__propertySmID = [];
        $uniqueKeyConstraints      = [];
        foreach ($models as $modelSmID => $model) {
            $properties = $model->getProperties();
            $meta       = $model->getPropertyMeta();
            $columns    = [];
            $primaries  = [];
            /**
             * @var                                     $propertySmID
             * @var \Sm\Data\Property\PropertySchematic $property
             */
            foreach ($properties as $propertySmID => $property) {
                try {
                    $column = $this->propertyToColumn($property);
                    if (!$column) continue;
                } catch (Exception $exception) {
                    continue;
                }
                
                if ($meta->isPrimary($property)) {
                    $primaries[] = $column;
                }
                $columns[]                                         = $column;
                $_allColumns__propertySmID[ $property->getSmID() ] = $column;
            }
            
            /** @var CreateTableStatement $createTable */
            $createTable = CreateTableStatement::init($model->getName())
                                               ->withColumns(...$columns);
            
            if (count($primaries)) {
                $createTable->withConstraints(PrimaryKeyConstraintSchema::init()
                                                                        ->addColumn(...$primaries));
            }
            
            # figure out unique keys
            $_unique_keys = $meta->getUniqueKeyGroup();
            if (!empty($_unique_keys)) {
                $constraint = UniqueKeyConstraintSchema::init();
                foreach ($_unique_keys as $_uniquePropertySmID) {
                    $column = $_allColumns__propertySmID[ $_uniquePropertySmID ] ?? null;
                    
                    if (!isset($column)) {
                        throw new Error("Could not find column {$_uniquePropertySmID}");
                    }
                    $constraint->addColumn($column);
                }
                $createTable->withConstraints($constraint);
            }
            
            $queries[]          = $createTable;
            $formattedQueries[] = MySqlQueryModule::init()->initialize()->getQueryFormatter()->format($createTable);
        }
        return [ $formattedQueries, $queries ];
    }
}