<?php


namespace WANGHORN\Entity\Password;

use Sm\Core\Context\Context;
use Sm\Core\Exception\UnimplementedError;
use Sm\Core\Resolvable\Resolvable;
use Sm\Data\Entity\Context\EntityCreationContext;
use Sm\Data\Entity\EntityHasPrimaryModelTrait;
use Sm\Data\Entity\Validation\EntityValidationResult;
use Sm\Data\Evaluation\Validation\ValidationResult;
use WANGHORN\Entity\Entity;

class Password extends Entity implements Resolvable {
    protected $internal = [];
    use EntityHasPrimaryModelTrait {
        find as _find;
        getPropertiesForModel as gProps;
    }
    public function set($na, $value = null) {
        return parent::set($na, $value);
    }
    protected function getPropertiesForModel(\Sm\Data\Entity\Entity $entity): array {
        $properties = $this->gProps($entity);
        $ret        = [];
        foreach ($properties as $name => $property) {
            if ($name === 'password') {
                $value        = "{$property->value}";
                $ret[ $name ] = password_hash($value, PASSWORD_BCRYPT);
            } else {
                $ret[ $name ] = $property;
            }
        }
        return $ret;
    }
    
    public function validate(Context $context = null): ValidationResult {
        if ($context instanceof EntityCreationContext) {
            /** @var \Sm\Data\Entity\Property\EntityProperty $password */
            $password                = $this->properties->password;
            $value_validation_result = $password->validate();
            $isSuccess               = $value_validation_result ? $value_validation_result->isSuccess() : true;
            
            if ($isSuccess) {
                return new EntityValidationResult($isSuccess,
                                                  'Password is the right length',
                                                  [ 'password' => $value_validation_result ]);
            }
            
            return new EntityValidationResult($isSuccess,
                                              $value_validation_result->getMessage(),
                                              [
                                                  'password' => $value_validation_result,
                                              ]);
        }
        return new EntityValidationResult(false, get_class($context));
    }
    
    public function jsonSerialize() {
        return false;
    }
    
    public function destroy() {
        throw new UnimplementedError("Cannot yet delete passwords");
    }
    /**
     * Get the end value of a Resolvable
     *
     * @return mixed
     */
    public function resolve() {
        /** @var \Sm\Data\Entity\Property\EntityProperty $password */
        $password = $this->properties->password;
        return $password->resolve();
    }
    /**
     * Save the Entity
     *
     * @param array $attributes The properties that we want to se on this Entity
     *
     * @return mixed
     */
    public function save($attributes = []) {
        throw new UnimplementedError("Cannot yet update passwords");
    }
}