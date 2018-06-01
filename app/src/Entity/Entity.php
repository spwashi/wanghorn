<?php


namespace WANGHORN\Entity;


use Sm\Core\Context\Context;
use Sm\Core\Internal\Monitor\Monitored;
use Sm\Data\Entity\Property\EntityAsProperty;
use Sm\Data\Entity\Property\EntityPropertySchematic;
use Sm\Data\Entity\Validation\EntityValidationResult;
use Sm\Data\Evaluation\Validation\ValidationResult;
use Sm\Data\Property\Property;

abstract class Entity extends \Sm\Data\Entity\Entity implements Monitored {
    public function validate(Context $context = null): ?ValidationResult {
        $property_errors = $this->getPropertyValidationErrors($context);
        $property_errors = array_filter($property_errors);
        return new EntityValidationResult(count($property_errors) < 1,
                                          'entity properties checked',
                                          $property_errors);
    }
    public function initialize() {
        return $this;
    }
    public function findProperty($property_name): Property {
        $property = $property_name instanceof Property ? $property_name : $this->properties->{$property_name};
        $this->fillPropertyValue($property);
        
        if (!($property instanceof EntityAsProperty)) return $property;
        
        $property->find();
        return $property;
    }
    
    
    #
    ##
    
    #
    ##
    public function jsonSerialize() {
        return parent::jsonSerialize();
    }
}