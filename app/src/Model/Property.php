<?php


namespace WANGHORN\Model;


use Sm\Data\Property\PropertyTrait;
use Sm\Data\Type\DateTime_;
use Sm\Data\Type\StandardDatatype;
use WANGHORN\Datatype\DatatypeFactory;

class Property extends \Sm\Data\Property\Property {
    const DATETIME_FORMAT = 'Y-m-d H:i:s';
    protected $datatypeFactory;
    use PropertyTrait {
        setDatatypeFactory as _setDataTypeFactory;
    }
    protected function getDatatypeFactory(): ?\Sm\Data\Type\DatatypeFactory {
        $datatypeFactory = $this->datatypeFactory ?? new DatatypeFactory();
        return $datatypeFactory;
    }
    public function setDatatypeFactory(\Sm\Data\Type\DatatypeFactory $datatypeFactory = null) {
        $this->datatypeFactory = $datatypeFactory ?? $this->_setDataTypeFactory($datatypeFactory);
        return $this;
    }
    public function resolve() {
        $primaryDatatype = $this->getPrimaryDatatype();
        $resolved        = parent::resolve();
        if ($primaryDatatype instanceof StandardDatatype) {
            if ($primaryDatatype instanceof DateTime_) {
                if (!$resolved) return null;
                $resolved = $this->getDatetimeValue($resolved);
            }
            return $primaryDatatype->setSubject($resolved)->resolve();
        }
        return $resolved;
    }
    public function validate() {
        $this->resolve();
    }
    public function getPrimaryDatatype() {
        $datatype_arr = $this->getDatatypes();
        return $datatype_arr[0] ?? null;
    }
    /**
     * @param $resolved
     *
     * @return bool|\DateTime
     */
    protected function getDatetimeValue($resolved) {
        $resolved = \DateTime::createFromFormat(static::DATETIME_FORMAT, $resolved);
        return $resolved;
    }
    public function jsonSerialize() {
        $value = $this->resolve();
        if (!($value instanceof \DateTime)) {
            return parent::jsonSerialize();
        }
        return $value->format(static::DATETIME_FORMAT);
    }
}