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

	#
	##  Initialization/Instantiation
	/**
	 * @param array                         $attributes
	 * @param \Sm\Core\Context\Context|null $context
	 *
	 * @return mixed|\Sm\Data\Entity\Entity
	 * @throws \Sm\Core\Resolvable\Exception\UnresolvableException
	 * @throws \Sm\Data\Entity\Exception\EntityNotFoundException
	 */
	public function find($attributes = [], Context $context = null) {
		return $this->findPrimaryModel($attributes, $context);
	}

	#
	##  Persistence
	/**
	 * @param \Sm\Core\Context\Context $context
	 * @param array                    $attributes
	 *
	 * @return \Sm\Data\Entity\Validation\EntityValidationResult
	 * @throws \Sm\Core\Resolvable\Exception\UnresolvableException
	 * @throws \Sm\Data\Entity\Exception\Persistence\CannotModifyEntityException
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

	/**
	 * @param \Sm\Data\Entity\Entity $entity
	 * @param Context|null           $context
	 * @return array
	 * @throws UnresolvableException
	 */
	protected function getPropertiesForModel(\Sm\Data\Entity\Entity $entity, Context $context = null): array {
		# Inherits from trait
		$properties = $this->gProps($entity, $context);

		# If we are creating the Entity (e.g. signup)
		if ($context instanceof EntityCreationContext) {
			$property               = $properties['password'];

			# Not sure why this would be the case
			if(!isset($property)) throw new UnresolvableException("Could not resolve password");

			$value                  = "{$property->value}";
			$properties['password'] = password_hash($value, PASSWORD_BCRYPT);;
		}

		return $properties;
	}

	public function matches($password) {
		return password_verify($password, $this->getPersistedIdentity()->properties->password);
	}

	#
	##  Validation
	public function validate(Context $context = null): ValidationResult {
		if ($context instanceof EntityCreationContext) {
			/** @var \Sm\Data\Entity\Property\EntityProperty $password */
			$password                = $this->properties->password;
			$value_validation_result = $password->validate();
			$isSuccess               = $value_validation_result ? $value_validation_result->isSuccess() : true;

			if ($isSuccess) {
				return new EntityValidationResult($isSuccess,
				                                  'Password is the right length',
				                                  ['password' => $value_validation_result]);
			}

			return new EntityValidationResult($isSuccess,
			                                  $value_validation_result->getMessage(),
			                                  [
				                                  'password' => $value_validation_result,
			                                  ]);
		}
		return new EntityValidationResult(false, get_class($context));
	}

	#
	##  Serialization
	public function jsonSerialize() {
		return 'Cannot be serialized';
	}
}