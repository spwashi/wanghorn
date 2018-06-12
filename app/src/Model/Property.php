<?php


namespace WANGHORN\Model;


use Sm\Data\Property\PropertyTrait;
use Sm\Data\Type\DateTime_;
use Sm\Data\Type\Exception\CannotCastException;

class Property extends \Sm\Data\Property\Property {
	const DATETIME_FORMAT = DATE_ISO8601;
	protected $datatypeFactory;
	use PropertyTrait {
		setDatatypeFactory as _setDataTypeFactory;
	}
	/**
	 * @param null $subject
	 *
	 * @return $this
	 * @throws \Sm\Data\Type\Exception\CannotCastException
	 * @throws \Sm\Core\Exception\InvalidArgumentException
	 */
	public function setSubject($subject = null): \Sm\Data\Property\Property {

		if ($this->getPrimaryDatatype() instanceof DateTime_ && isset($subject)) {
			if ($subject instanceof \DateTime) {
				$new_subject = $subject;
			} else {
				$new_subject = \DateTime::createFromFormat(static::DATETIME_FORMAT, $subject);
			}

			if ($new_subject) {
				$subject = $new_subject;
			} else {
				throw new CannotCastException("Cannot resolve datetime format -- use " . static::DATETIME_FORMAT . " , not " . json_encode($subject));
			}
		}

		return parent::setSubject($subject);
	}
	/**
	 * @return array|mixed|null|\Sm\Core\Resolvable\Resolvable|string
	 * @throws \Sm\Core\Exception\UnimplementedError
	 */
	public function jsonSerialize() {
		$value = $this->resolve();
		return $value instanceof \DateTime ? $value->format(static::DATETIME_FORMAT) : parent::jsonSerialize();
	}
}