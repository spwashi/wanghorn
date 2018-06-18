<?php


namespace WANGHORN\Model;


use Sm\Data\Property\PropertyTrait;
use Sm\Data\Type\Undefined_;

class Property extends \Sm\Data\Property\Property {
	const DATETIME_FORMAT = DATE_ISO8601;
	protected $datatypeFactory;
	use PropertyTrait {
		setDatatypeFactory as _setDataTypeFactory;
	}
	public function resolve() {
		$subject = parent::resolve();
		if ($subject instanceof Undefined_) return $subject;
		return $subject;
	}


	/**
	 * @return array|mixed|null|\Sm\Core\Resolvable\Resolvable|string
	 * @throws \Sm\Core\Exception\UnimplementedError
	 */
	public function jsonSerialize() {
		$value = $this->value;
		return $value instanceof \DateTime ? $value->format(static::DATETIME_FORMAT) : parent::jsonSerialize();
	}
}