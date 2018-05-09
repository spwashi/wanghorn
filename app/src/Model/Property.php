<?php


namespace WANGHORN\Model;


use Sm\Data\Property\PropertyTrait;
use Sm\Data\Type\DateTime_;

class Property extends \Sm\Data\Property\Property {
    const DATETIME_FORMAT = 'Y-m-d H:i:s';
    protected $datatypeFactory;
    use PropertyTrait {
        setDatatypeFactory as _setDataTypeFactory;
    }
    public function setSubject($subject = null) {
        if ($this->getPrimaryDatatype() instanceof DateTime_) {
            $subject = \DateTime::createFromFormat(static::DATETIME_FORMAT, $subject);
        }
        return parent::setSubject($subject);
    }
    /**
     * @throws \Sm\Core\Exception\UnimplementedError
     */
    public function validate() {
        $this->resolve();
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