<?php

namespace WANGHORN\Controller\Dev\Query\Model;


use Sm\Core\Exception\Error;
use Sm\Core\Exception\Exception;
use Sm\Core\Exception\UnimplementedError;
use Sm\Data\Model\ModelPropertyMetaSchematic;
use Sm\Data\Model\ModelSchematic;
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
use Sm\Modules\Query\Sql\Formatting\SqlQueryFormatter;
use Sm\Modules\Query\Sql\Formatting\SqlQueryFormatterManager;
use Sm\Modules\Query\Sql\SqlDisplayContext;
use Sm\Modules\Query\Sql\Statements\AlterTableStatement;
use Sm\Modules\Query\Sql\Statements\CreateTableStatement;
use WANGHORN\Controller\Dev\DevController;
/** @property-read SqlQueryFormatterManager $formatter */
class QueryController extends DevController {
	public function __get($name) {
		switch ($name) {
			case 'formatter':
				return $this->getQueryFormatter();
			default:
				return parent::__get($name);
		}
	}
	function queries(): array {
		$models                   = $this->app->data->models->getRegisteredSchematics();
		$all_columns              = [];
		$tableReferenceArr__array = [];
		$modelPersistenceManager  = $this->app->data->models->persistenceManager;
		$model_query_array        = [];


		foreach ($models as $modelSmID => $modelSchematic) {
			/** @var ModelSchematic $modelSchematic */
			$tableName = $modelPersistenceManager->getModelSource($modelSchematic)->getName();

			# Don't attempt to create tables that begin with an underscore
			if (strpos($tableName, '_') === 0) continue;

			$columns                       = $this->convertPropertiesToColumns($modelSchematic);
			$all_columns                   = array_merge($all_columns, $columns);
			$createTableStatement          = $this->createCreateTableStatement($modelSchematic, $columns);
			$create_table_arr              = [];
			$create_table_arr['string']    = $this->formatter->format($createTableStatement, new SqlDisplayContext);
			$model_query_array[$modelSmID] = ['create_table' => $create_table_arr];
			#$create_table_arr['query']     = $createTableStatement;
		}


		$alterTableStatements = $this->createAlterTableStatements($all_columns);
		$model_query_array    = array_merge_recursive($model_query_array, $alterTableStatements);
		return $model_query_array;
	}

	/** @param ColumnMeta[] $all_columns */
	private function createAlterTableStatements(array $all_columns): array {

		$statements = [];
		foreach ($all_columns as $smID => $columnMeta) {
			$reference = $columnMeta->reference;
			if (!isset($reference)) continue;

			$referenceSmID    = $reference;
			$referencedColumn = $all_columns[$reference] ?? null;

			if (!isset($referencedColumn)) throw new Exception("Cannot reference " . $referenceSmID);

			$tableName = $this->getModelTablename($columnMeta->propertyOwnerSchematic);
			# Create the Foreign Key Constraint
			$constraint_name      = $tableName . '__' . ($columnMeta->column->getName() ?: '') . '__' . ($referencedColumn->column->getName() ?: '');
			$foreignKeyConstraint = ForeignKeyConstraintSchema::init();
			$foreignKeyConstraint->setConstraintName($constraint_name);
			$foreignKeyConstraint->addColumn($columnMeta->column);
			$foreignKeyConstraint->addRefeferencedColumns($referencedColumn->column);

			# Create the AlterTableStatement
			$alterTable = AlterTableStatement::init($tableName);
			$alterTable->withConstraints($foreignKeyConstraint);

			# Add the AlterTableStatement to the array
			$smID                               = $columnMeta->propertyOwnerSchematic->getSmID();
			$statements[$smID]                  = $statements[$smID] ?? ['alter_table' => []];
			$alterTableString                   = $this->formatter->format($alterTable, new SqlDisplayContext);
			$statements[$smID]['alter_table'][] = ['query' => '', 'string' => $alterTableString];
		}

		return $statements;
	}
	private function convertPropertiesToColumns(ModelSchematic $modelSchematic): array {
		$properties  = $modelSchematic->getProperties();
		$meta        = $modelSchematic->getPropertyMeta();
		$table_name  = $this->getModelTablename($modelSchematic);
		$tableSchema = TableSourceSchematic::init()->setName($table_name);


		$all_columns = [];

		foreach ($properties as $property_name => $property) {
			/** @var $property PropertySchematic */
			$smID                               = $property->getSmID();
			$columnMeta                         = new ColumnMeta;
			$columnMeta->propertyOwnerSchematic = $modelSchematic;
			$columnMeta->property               = $property;
			$columnMeta->smID                   = $smID;
			$columnMeta->isPrimary              = $meta->isPrimary($columnMeta->smID);
			$columnMeta->column                 = $this->propertyToColumn($property, $tableSchema);
			$columnMeta->reference              = $property->getReferenceDescriptor() ? $property->getReferenceDescriptor()->getHydrationMethod() : null;
			$all_columns[$smID]                 = $columnMeta;
		}


		return $all_columns;
	}
	private function createCreateTableStatement(ModelSchematic $model, array $columnMeta_array): CreateTableStatement {
		$primaries            = [];
		$unique_smIDs         = $model->getPropertyMeta()->getUniqueKeyGroup();
		$columns              = [];
		$createTableStatement = CreateTableStatement::init($this->getModelTablename($model));

		foreach ($columnMeta_array as $columnMeta) {
			/** @var ColumnMeta $columnMeta */
			if ($columnMeta->isPrimary) $primaries[] = $columnMeta->column;

			$columns[] = $columnMeta->column;
		}

		$createTableStatement->withColumns(...$columns);

		if (!empty($primaries)) $createTableStatement->withConstraints(PrimaryKeyConstraintSchema::init()->addColumn(...$primaries));
		if (!empty($unique_smIDs)) $this->addUniqueKeyConstraint($unique_smIDs, $columnMeta_array, $createTableStatement);

		return $createTableStatement;
	}
	private function addUniqueKeyConstraint(array $unique_smIDs, array $all_columns, CreateTableStatement $createTable): void {
		$constraint = UniqueKeyConstraintSchema::init();
		foreach ($unique_smIDs as $_uniquePropertySmID) {
			$columnMeta = $all_columns[$_uniquePropertySmID] ?? null;
			if (!isset($columnMeta)) throw new Error("Could not find column {$_uniquePropertySmID}");
			$constraint->addColumn($columnMeta->column);
		}
		$createTable->withConstraints($constraint);
	}
	private function getModelTablename(ModelSchematic $model) {
		$persistenceManager = $this->app->data->models->persistenceManager;
		$table_name         = $persistenceManager->getModelSource($model)->getName();
		return $table_name;
	}
	private function propertyToColumn(PropertySchematic $propertySchema, TableSourceSchematic $tableSourceSchematic) {
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
	private function _initIntColumn(PropertySchematic $propertySchema): ColumnSchema {
		$column = IntegerColumnSchema::init();
		$column->setAutoIncrement($propertySchema->isGenerated())
		       ->setName($propertySchema->getName())
		       ->setLength($propertySchema->getLength() ?? 11);
		return $column;
	}
	private function _initDatetimeColumn(PropertySchematic $propertySchema): ColumnSchema {
		$column = DateTimeColumnSchema::init();
		$column->setName($propertySchema->getName());
		$column->setOnUpdate($propertySchema->getOnModelUpdateValue());
		return $column;
	}
	private function _initStringColumn(PropertySchematic $propertySchema): ColumnSchema {
		$column = VarcharColumnSchema::init()
		                             ->setName($propertySchema->getName())
		                             ->setLength($propertySchema->getLength() ?? 25);
		return $column;
	}
	/**
	 * @return null|SqlQueryFormatterManager
	 * @throws Exception
	 */
	protected function getQueryFormatter() {
		return MySqlQueryModule::init()->initialize()->getQueryFormatter();
	}
}