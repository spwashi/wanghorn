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
    }
    
    #
    ##
    #
    public function create($attributes = []) {
        if (!isset($attributes['email'])) {
            throw new UnimplementedError("Cannot add User without Email Address");
        }
        
        foreach ($attributes as $index => $attribute) {
            $this->properties->register($index, Property::init()->setValue($attribute));
        }
        $this->set($attributes);
        $model = $this->getPersistedIdentity($this->modelDataManager);
        $model->set([
                        'email'      => $this->properties->email,
                        'first_name' => $this->properties->first_name,
                        'last_name'  => $this->properties->last_name,
                    ]);
        echo '<pre>' . json_encode($model) . '</pre>';
        $result = $this->modelDataManager->persistenceManager->create($model);
        var_dump($result);
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
     * @throws \Sm\Core\Resolvable\Error\UnresolvableException
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
                    $this->findProperty($this->properties->{$property_name});
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
     * @throws \Sm\Core\Resolvable\Error\UnresolvableException
     */
    public function findPassword(): Property {
        return $this->findProperty($this->properties->password);
    }
    /**
     * @return \Sm\Data\Property\Property
     * @throws \Sm\Core\Resolvable\Error\UnresolvableException
     */
    public function findUsername(): Property {
        return $this->findProperty($this->properties->username);
    }
    public function validate(Context $context = null): EntityValidationResult {
        $result = new EntityValidationResult(false, "Can't create new users yet", []);
        return $result;
    }
}