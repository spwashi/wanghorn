<?php


namespace WANGHORN\Entity;


use Sm\Core\Context\Context;
use Sm\Core\Internal\Monitor\Monitored;
use Sm\Data\Entity\Property\EntityAsProperty;
use Sm\Data\Entity\Property\EntityPropertySchematic;
use Sm\Data\Entity\Validation\EntityValidationResult;
use Sm\Data\Property\Property;

abstract class Entity extends \Sm\Data\Entity\Entity implements Monitored {
    public function jsonSerialize() {
        return parent::jsonSerialize();
    }
    public function initialize() {
        return $this;
    }
    /**
     * @param \Sm\Data\Property\Property $property
     *
     * @return \Sm\Data\Property\Property
     * @throws \Sm\Core\Resolvable\Error\UnresolvableException
     * @throws \Sm\Core\Exception\UnimplementedError
     */
    public function findProperty(Property $property): Property {
        $this->fillPropertyValue($property);
        if (!($property instanceof EntityAsProperty)) return $property;
        
        $property->find();
        return $property;
    }
    public function updateComponentProperties() {
        /**
         * @var Property $property
         */
        foreach ($this->properties as $property) {
            $effectiveSchematic = $property->getEffectiveSchematic();
            if (!($effectiveSchematic instanceof EntityPropertySchematic)) continue;
            $derivedFrom = $effectiveSchematic->getDerivedFrom();
            if (is_array($derivedFrom)) {
                foreach ($derivedFrom as $propertyName => $smID) {
                    $property = $this->setInternalProperty($smID, $property->value);
                    var_dump([ $propertyName, $smID, $property->raw_value ]);
                }
            }
        }
    }
    
    protected function setInternalProperty(string $property_name_or_smID, $value) {
        $property = $this->properties->$property_name_or_smID;
        if (!isset($property)) {
            $modelSchema = $this->getPersistedIdentity();
            $properties  = $modelSchema->getProperties();
            $property    = $properties->{$property_name_or_smID};
        }
        $property->value = $value;
        return $property;
    }
    public function validate(Context $context = null): EntityValidationResult {
        $result = new EntityValidationResult(false, "Can't create a new {$this->getName()} yet", []);
        return $result;
    }
}