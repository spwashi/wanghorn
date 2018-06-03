<?php


namespace WANGHORN\Entity\User;


use Sm\Core\Context\Context;
use Sm\Core\Exception\UnimplementedError;
use Sm\Data\Entity\Context\EntityContext;
use Sm\Data\Entity\EntityHasPrimaryModelTrait;
use Sm\Data\Entity\Validation\EntityValidationResult;
use Sm\Data\Property\Property;
use Sm\Data\Property\PropertyContainer;
use WANGHORN\Entity\Entity;
use WANGHORN\Entity\User\Schema\UserEntitySchema;

class User extends Entity implements UserEntitySchema {
    use EntityHasPrimaryModelTrait;
    
    #
    ##  Persistence
    public function save($attributes = []) {
        throw new UnimplementedError("Cannot save User");
    }
    public function destroy() { }
    public function create(Context $context, $attributes = []): EntityValidationResult {
        $result = $this->createPrimaryModel($context, $attributes);
        
        if (!$result->isSuccess()) return $result;
        
        $this->fillPropertyValue($this->properties->password);
        
        $this->properties->password->create($context);
        
        return $result;
    }
    public function find($attributes = [], Context $context = null) {
        $this->findPrimaryModel($attributes, $context);
        
        if (!($context instanceof EntityContext)) return $this;
        
        $smID            = $this->getSmID();
        $entitySchematic = $context->getSchematic($smID);
        
        if (!isset($entitySchematic)) return $this;
        
        $all_property   = $entitySchematic->getProperties()->getAll(true);
        $property_names = array_keys($all_property);
        
        foreach ($property_names as $property_name) $this->findProperty($property_name);
        
        return $this;
    }
    #
    ##  Getters/Setters
    public function getProperties(): PropertyContainer { return parent::getProperties(); }
    #
    ##  Initialization/Instantiation
    public function findPassword(): Property {
        return $this->findProperty($this->properties->password);
    }
    public function findUsername(): Property {
        return $this->findProperty($this->properties->username);
    }
}