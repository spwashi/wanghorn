<?php


namespace WANGHORN\Entity\User;


use Sm\Core\Exception\UnimplementedError;
use Sm\Core\Resolvable\Error\UnresolvableException;
use Sm\Data\Entity\EntityHasPrimaryModelTrait;
use Sm\Data\Entity\Property\EntityAsProperty;
use Sm\Data\Entity\Property\EntityPropertySchematic;
use Sm\Data\Property\Property;
use Sm\Data\Property\PropertyContainer;
use WANGHORN\Entity\Entity;
use WANGHORN\Model\Model;

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
    public function destroy() {
        $primaryModel = $this->getPrimaryModel($this->modelDataManager);
        $result       = $this->modelDataManager->persistenceManager->markDelete($primaryModel);
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
}