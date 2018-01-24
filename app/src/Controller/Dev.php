<?php

namespace EXAMPLE_APP_NAMESPACE\Controller;

use Error;
use Sm\Application\Controller\BaseApplicationController;
use Sm\Core\Exception\Exception;
use Sm\Core\Exception\UnimplementedError;
use Sm\Data\Model\Model;
use Sm\Data\Property\PropertySchematic;
use Sm\Modules\Sql\Constraints\PrimaryKeyConstraintSchema;
use Sm\Modules\Sql\Constraints\UniqueKeyConstraintSchema;
use Sm\Modules\Sql\Data\Column\ColumnSchema;
use Sm\Modules\Sql\Data\Column\DateTimeColumnSchema;
use Sm\Modules\Sql\Data\Column\IntegerColumnSchema;
use Sm\Modules\Sql\Data\Column\VarcharColumnSchema;
use Sm\Modules\Sql\MySql\Module\MySqlQueryModule;
use Sm\Modules\Sql\Statements\CreateTableStatement;

/**
 * Class Home
 *
 * The controller that contains the core of the application logic.
 */
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
        
        $column->setDefault($propertySchema->getDefaultValue());
        
        if (!isset($column)) {
            throw new Exception("Could not create Column");
        }
        
        $is_null = in_array('null', $datatypes);
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
        $models = $this->app->data->models->getConfiguredModels();
        
        list($all, $queries) = $this->formatModels($models);
        
        $do_interpret = 1;
        
        if ($do_interpret == true) {
            foreach ($queries as $query) {
                
                echo "<pre>";
                echo MySqlQueryModule::init()->initialize()->getQueryFormatter()->format($query);
                echo "</pre><br>----------------------------------------------------";
                
                $results = $this->app->query->interpret($query);
                echo "<pre>";
                echo json_encode($results, JSON_PRETTY_PRINT);
                echo "</pre><br>";
            }
        }
        
        
        $joined = join('<br>', $all);
        echo "<pre>{$joined}</pre>";
    }
    public function eg() {
        $application = $this->app;
        $dataLayer   = $application->data;
        
        
        # Instantiate a Model that we'll use to find a matching object (or throw an error if it doesn't exist)
        $_sam_model                 = $dataLayer->models->instantiate('users');
        $_sam_model->properties->id = 1;
        
        # The Model PersistenceManager is an object that gives us access to standard ORM methods
        ##  find, save, create, mark_delete (haven't implemented DELETE statements yet)
        $modelPersistenceManager = $dataLayer->models->persistenceManager;
        
        
        /** @var Model $sam */
        # This would throw an error if the Model could not be found
        $sam = $modelPersistenceManager->find($_sam_model);
        
        if ($sam->properties->first_name->value !== 'Samuel') {
            $modelPersistenceManager->mark_delete($sam);
        } else {
            $sam->properties->first_name = 'Mr. Samuel';
            $modelPersistenceManager->save($sam);
        }
        
        
        # -- rendering
        
        $vars     = [ 'path_to_site' => $this->app->path, ];
        $rendered = $application->representation->render('hello.twig', $vars);
        
        #
        
        return $rendered;
    }
    
    /**
     * @param  \Sm\Data\Model\ModelSchematic[] $models
     *
     * @return array
     * @throws \Error
     */
    protected function formatModels($models): array {
        $all                       = [];
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
            
            $queries[] = $createTable;
            $all[]     = MySqlQueryModule::init()->initialize()->getQueryFormatter()->format($createTable);
        }
        return [ $all, $queries ];
    }
}