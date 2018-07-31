<?php


namespace WANGHORN\Entity\Password;

use Sm\Core\Context\Context;
use Sm\Core\Exception\UnimplementedError;
use Sm\Core\Resolvable\Exception\UnresolvableException;
use Sm\Core\Resolvable\Resolvable;
use Sm\Data\Entity\Context\EntityCreationContext;
use Sm\Data\Entity\EntityHasPrimaryModelTrait;
use Sm\Data\Entity\Validation\EntityValidationResult;
use Sm\Data\Evaluation\Validation\ValidationResult;
use Sm\Data\Property\Context\PropertyContainerProxy;
use WANGHORN\Entity\Entity\Entity;


/**
 * Class Password
 *
 * * Currently hashed using the BCRYPT algorithm
 */
class Password extends Entity implements Resolvable {
    protected $internal = [];
    use EntityHasPrimaryModelTrait {
        getPropertiesForModel as gProps;
    }

    #
    ##  Resolution
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
    public function proxyPropertiesInContext(Context $context = null): PropertyContainerProxy {
        return PropertyContainerProxy::init($this->getProperties(), $context);
    }

    #
    ##  Initialization/Instantiation
    /**
     * @param array $attributes
     * @param \Sm\Core\Context\Context|null $context
     *
     * @return mixed|\Sm\Data\Entity\Entity
     * @throws \Sm\Core\Resolvable\Exception\UnresolvableException
     * @throws \Sm\Data\Entity\Exception\EntityNotFoundException
     */
    public function find($attributes = [], Context $context = null) {
        return $this->findPrimaryModel($attributes, $context);
    }
    protected function initComponentManager($entityDataManager): \Sm\Data\Entity\Component\ComponentManager {
        return new \WANGHORN\Entity\Password\PasswordComponentManager($this, $entityDataManager);
    }


    #
    ##  Persistence
    /**
     * @param \Sm\Core\Context\Context $context
     * @param array $attributes
     *
     * @return \Sm\Data\Entity\Validation\EntityValidationResult
     * @throws \Sm\Core\Resolvable\Exception\UnresolvableException
     */
    public function create(Context $context, $attributes = []): ?EntityValidationResult {
        return $this->createPrimaryModel($context, $attributes);
    }
    public function destroy() {
        throw new UnimplementedError("Cannot yet delete passwords");
    }
    public function save($attributes = []) {
        throw new UnimplementedError("Cannot yet update passwords");
    }
    protected function getPropertiesForModel(\Sm\Data\Entity\Entity $entity, Context $context = null): array {
        # Inherits from trait
        $properties = $this->gProps($entity, $context);

        # If we are creating the Entity (e.g. signup)
        if ($context instanceof EntityCreationContext) {
            $property = $properties['password'];

            # Not sure why this would be the case
            if (!isset($property)) {
                throw new UnresolvableException("Could not resolve password");
            }

            $value                  = "{$property->value}";
            $properties['password'] = password_hash($value, PASSWORD_BCRYPT);;
        }

        return $properties;
    }
    public function matches($password) {
        $model                 = $this->getPersistedIdentity();
        $current_password_hash = $model->properties->password;
        return password_verify($password, $current_password_hash);
    }

    #
    ##  Validation
    public function validate(Context $context = null): ValidationResult {
        if ($context instanceof EntityCreationContext) {
            /** @var \Sm\Data\Entity\Property\EntityProperty $password */
            $password                 = $this->properties->password;
            $propertyValidationResult = $password->validate();
            $isSuccess                = $propertyValidationResult ? $propertyValidationResult->isSuccess() : true;

            if ($isSuccess) {
                return new EntityValidationResult($isSuccess, 'Password is the right length', ['password' => $propertyValidationResult]);
            }

            $validation_message = $propertyValidationResult->getMessage();
            $validationResult   = new EntityValidationResult($isSuccess, $validation_message, ['password' => $propertyValidationResult,]);
            $validationResult->setFailedAttributes($propertyValidationResult->getFailedAttributes());
            return $validationResult;
        }
        return new EntityValidationResult(false, get_class($context));
    }

    #
    ##  Serialization
    public function jsonSerialize() {
        return 'Cannot be serialized';
    }
}