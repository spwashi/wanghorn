<?php


namespace WANGHORN\Model\User;


use Sm\Core\Exception\UnimplementedError;
use Sm\Data\Entity\Entity;
use Sm\Data\Entity\EntityHasPrimaryModelTrait;
use Sm\Data\Property\Property;
use Sm\Data\Property\PropertyContainer;

/**
 * Class User
 *
 * @property-read                                                         $authentications
 * @property-read UserPropertyContainer                                   $properties
 */
class User extends Entity {
    protected $primaryModelName = 'users';
    protected $_authentications;
    
    use EntityHasPrimaryModelTrait;
    
    #
    ##
    #
    public function create($attributes = []) {
        if (!isset($attributes['email'])) {
            throw new UnimplementedError("Cannot add User without Email Address");
        }
        
        foreach ($attributes as $index => $attribute) {
            $this->properties->register($index, Property::init()
                                                        ->setValue($attribute));
        }
        $this->set($attributes);
        var_dump($this->properties);
        $model = $this->getPrimaryModel($this->modelDataManager);
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
    public function find($attributes = [], $context = 0): User {
        $this->registerPropertyValues($attributes);
        
        $primaryModel = $this->findPrimaryModel($this->modelDataManager);
        
        $this->registerPropertyValues([
                                          'user_id'    => $primaryModel->properties->id,
                                          'first_name' => $primaryModel->properties->first_name,
                                          'email'      => $primaryModel->properties->email,
                                          'last_name'  => $primaryModel->properties->last_name,
                                      ]);
        return $this;
    }
    public function destroy() {
        $primaryModel = $this->getPrimaryModel($this->modelDataManager);
        $result       = $this->modelDataManager->persistenceManager->mark_delete($primaryModel);
        var_dump($result);
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
    protected function getPrimaryModelProperties($context = null): PropertyContainer {
        $propertyArray = [
            'id'         => $this->properties->user_id,
            'first_name' => $this->properties->first_name,
            'last_name'  => $this->properties->last_name,
        ];
        $propertyArray = array_filter($propertyArray);
        return PropertyContainer::init()->register($propertyArray);
    }
    
    /**
     * @param $attributes
     */
    protected function registerPropertyValues($attributes): void {
        $properties = [];
        foreach ($attributes as $index => $value) {
            $originalProperty        = $this->getProperties()->$index ?? Property::init();
            $originalProperty->value = $value;
            $newProperty             = $originalProperty;
            $properties[ $index ]    = $newProperty;
        }
        $this->getProperties()->register($properties);
    }
}