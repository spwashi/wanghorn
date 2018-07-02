<?php


namespace WANGHORN\Controller\Dev\Query\Model;


use Sm\Data\Model\ModelSchematic;
use Sm\Modules\Query\Sql\Data\Column\ColumnSchema;
class ColumnMeta {
	public $isPrimary;
	/** @var ColumnSchema */
	public $column;
	public $property;
	public $smID;
	/** @var ModelSchematic */
	public $propertyOwnerSchematic;
	public $reference;
}