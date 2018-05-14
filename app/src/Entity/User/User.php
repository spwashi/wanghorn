<?php


namespace WANGHORN\Entity\User;


use Sm\Core\Context\Context;
use Sm\Core\Exception\UnimplementedError;
use Sm\Data\Entity\Context\EntityContext;
use Sm\Data\Entity\EntityHasPrimaryModelTrait;
use Sm\Data\Entity\Property\Validation\EntityPropertyValidationResult;
use Sm\Data\Entity\Validation\EntityValidationResult;
use Sm\Data\Evaluation\Validation\ValidationResult;
use Sm\Data\Property\Exception\NonexistentPropertyException;
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
    }
    
    #
    ##
    #
    public function create($attributes = []) {
        throw new UnimplementedError("Cannot yet create Users");
    }
    public function save($attributes = []) {
        throw new UnimplementedError("Cannot save User");
    }
    public function destroy() {
        $primaryModel = $this->getPersistedIdentity();
        $result       = $this->modelDataManager->persistenceManager->markDelete($primaryModel);
    }
    /**
     * @param array                         $attributes
     * @param \Sm\Core\Context\Context|null $context
     *
     * @return $this|mixed
     * @throws \Sm\Core\Resolvable\Exception\UnresolvableException
     * @throws \Sm\Data\Entity\Exception\EntityModelNotFoundException
     * @throws \Sm\Data\Property\Exception\NonexistentPropertyException
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
    public function setPassword($password) {
        $hash           = 'hello';
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        
        throw new UnimplementedError("Need to figure out how to store passwords");
        
        return $this;
    }
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
    
    public function validate(Context $context = null): ValidationResult {
        $propertyValidationResults = $this->validateProperties($context);
        return new EntityValidationResult(false, "Can't create new users yet", $propertyValidationResults);
    }
    public function validateProperties(Context $context): array {
        $propertyValidationResults = [];
        /** @var \Sm\Data\Entity\Property\EntityProperty $property */
        foreach ($this->properties as $property_identifier => $property) {
            try {
                if (!$property) throw new NonexistentPropertyException('Cannot set ' . $property_identifier . ' on User');
                $result                                            = $property->validate($context);
                $propertyValidationResults[ $property_identifier ] = $result;
            } catch (NonexistentPropertyException $exception) {
                $exception_msg                                     = $exception->getMessage();
                $propertyValidationResults[ $property_identifier ] = new EntityPropertyValidationResult(false, $exception_msg);
            }
        }
        return $propertyValidationResults;
    }
}