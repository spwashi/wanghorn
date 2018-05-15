<?php


namespace WANGHORN\Model;


use Sm\Data\Property\PropertyTrait;
use Sm\Data\Type\DateTime_;
use Sm\Data\Type\Exception\CannotCastException;

class Property extends \Sm\Data\Property\Property {
    const DATETIME_FORMAT = 'Y-m-d H:i:s';
    protected $datatypeFactory;
    use PropertyTrait {
        setDatatypeFactory as _setDataTypeFactory;
    }
    /**
     * @param null $subject
     *
     * @return $this
     * @throws \Sm\Data\Type\Exception\CannotCastException
     */
    public function setSubject($subject = null) {
        if ($this->getPrimaryDatatype() instanceof DateTime_) {
            $new_subject = \DateTime::createFromFormat(static::DATETIME_FORMAT, $subject);
            if ($new_subject) $subject = $new_subject;
            else throw new CannotCastException("Cannot resolve datetime format -- use " . static::DATETIME_FORMAT);
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