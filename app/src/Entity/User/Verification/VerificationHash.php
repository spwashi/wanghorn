<?php


namespace WANGHORN\Entity\User\Verification;

use Sm\Core\Context\Context;
use Sm\Core\Exception\UnimplementedError;
use Sm\Core\Resolvable\Resolvable;
use Sm\Data\Entity\Context\EntityCreationContext;
use Sm\Data\Entity\EntityHasPrimaryModelTrait;
use Sm\Data\Entity\Validation\EntityValidationResult;
use Sm\Data\Evaluation\Validation\ValidationResult;
use WANGHORN\Entity\Entity;


/**
 * Class VerificationHash
 *
 * * Currently hashed using the BCRYPT algorithm
 */
class VerificationHash extends Entity implements Resolvable {
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
		/** @var \Sm\Data\Entity\Property\EntityProperty $verificationHash */
		$verificationHash = $this->properties->hash;
		return $verificationHash->resolve();
	}

	#
	##  Initialization/Instantiation
	public function find($attributes = [], Context $context = null) {
		return $this->findPrimaryModel($attributes, $context);
	}

	#
	##  Persistence
	public function create(Context $context, $attributes = []): ?EntityValidationResult {
		return $this->createPrimaryModel($context, $attributes);
	}

	public function destroy() {
		throw new UnimplementedError("Cannot yet delete verificationHashes");
	}

	public function save($attributes = []) {
		throw new UnimplementedError("Cannot yet update verificationHashes");
	}

	protected function getPropertiesForModel(\Sm\Data\Entity\Entity $entity, Context $context = null): array {
		$properties = $this->gProps($entity);
		if($context instanceof EntityCreationContext){
			$properties['hash'] = md5(date('mdy').date('mdy').microtime());
		}
		return $properties;
	}

	public function matches($verificationHash) {
		return verificationHash_verify($verificationHash, $this->getPersistedIdentity()->properties->verificationHash);
	}

	#
	##  Validation
	public function validate(Context $context = null): ValidationResult {
		if ($context instanceof EntityCreationContext) {
			/** @var \Sm\Data\Entity\Property\EntityProperty $verificationHash */
			$verificationHash                = $this->properties->hash;
			$value_validation_result = $verificationHash->validate();
			$isSuccess               = $value_validation_result ? $value_validation_result->isSuccess() : true;

			if ($isSuccess) {
				return new EntityValidationResult($isSuccess,
				                                  'VerificationHash is the right length',
				                                  ['verificationHash' => $value_validation_result]);
			}

			return new EntityValidationResult($isSuccess,
			                                  $value_validation_result->getMessage(),
			                                  [
				                                  'verificationHash' => $value_validation_result,
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