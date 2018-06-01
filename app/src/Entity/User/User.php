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

/**
 * Class User
 *
 * @property-read                                                         $authentications
 * @property-read UserPropertyContainer                                   $properties
 */
class User extends Entity {
    use EntityHasPrimaryModelTrait {
        find as _find;
        create as _create;
    }
    
    #
    ##
    #
    public function save($attributes = []) {
        throw new UnimplementedError("Cannot save User");
    }
    public function destroy() {
        $primaryModel = $this->getPersistedIdentity();
        $result       = $this->modelDataManager->persistenceManager->markDelete($primaryModel);
    }
    public function create(Context $context, $attributes = []): EntityValidationResult {
        
        $passwordProperty = $this->getProperties()->password;
        $result           = $this->_create($context, $attributes);
        
        if (!$result->isSuccess()) return $result;
        
        $this->fillPropertyValue($passwordProperty);
        $passwordProperty->create($context);
        /** @var Entity $passwordEntity */
        $passwordEntity = $passwordProperty->value;
        var_dump($passwordEntity->getPersistedIdentity());
        die();
    }
    /**
     * @param array                         $attributes
     * @param \Sm\Core\Context\Context|null $context
     *
     * @return $this|mixed
     * @throws \Sm\Core\Resolvable\Exception\UnresolvableException
     * @throws \Sm\Data\Entity\Exception\EntityModelNotFoundException
     * @throws \Sm\Data\Property\Exception\NonexistentPropertyException
     * @throws \Sm\Data\Entity\Exception\EntityNotFoundException
     */
    public function find($attributes = [], Context $context = null) {
        $this->_find($attributes, $context);
        if ($context instanceof EntityContext) {
            $entitySchematic = $context->getSchematic($this->getSmID());
            if (isset($entitySchematic)) {
                $properties     = $entitySchematic->getProperties();
                $property_names = array_keys($properties->getAll(true));
                foreach ($property_names as $property_name) {
                    $this->findProperty($property_name);
                }
            }
        }
        return $this;
    }
    
    #
    ##
    #
    public function passwordMatches($password) {
        $expectedPasswordHash = '';
        return password_verify($password, $expectedPasswordHash);
    }
    /**
     * @return UserPropertyContainer|PropertyContainer
     */
    public function getProperties(): PropertyContainer {
        return parent::getProperties();
    }
    /**
     * @throws \Sm\Core\Resolvable\Exception\UnresolvableException
     */
    public function findPassword(): Property {
        return $this->findProperty($this->properties->password);
    }
    /**
     * @return \Sm\Data\Property\Property
     * @throws \Sm\Core\Resolvable\Exception\UnresolvableException
     */
    public function findUsername(): Property {
        return $this->findProperty($this->properties->username);
    }
}