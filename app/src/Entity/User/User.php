<?php


namespace WANGHORN\Entity\User;


use Sm\Core\Context\Context;
use Sm\Core\Exception\InvalidArgumentException;
use Sm\Core\Exception\UnimplementedError;
use Sm\Core\Resolvable\Exception\UnresolvableException;
use Sm\Data\Entity\Context\EntityContext;
use Sm\Data\Entity\EntityHasPrimaryModelTrait;
use Sm\Data\Entity\EntitySchema;
use Sm\Data\Entity\Exception\Persistence\CannotModifyEntityException;
use Sm\Data\Entity\Validation\EntityValidationResult;
use Sm\Data\Property\Property;
use Sm\Data\Property\PropertyContainer;
use WANGHORN\Entity\Entity\Entity;
use WANGHORN\Entity\User\Proxy\UserEntityProxy;
use WANGHORN\Entity\User\Schema\UserEntitySchema;

/**
 */
class User extends Entity implements UserEntitySchema {
	use EntityHasPrimaryModelTrait;

	#
	##  Persistence
	public function save($attributes = []) {
		throw new UnimplementedError("Cannot save User");
	}

	public function destroy() { }

	/**
	 * Create the User record -- assume we know everything we'd want to
	 *
	 * @param Context $context
	 * @param array   $attributes
	 * @return EntityValidationResult
	 * @throws UnimplementedError
	 * @throws InvalidArgumentException
	 * @throws UnresolvableException
	 * @throws CannotModifyEntityException
	 */
	public function create(Context $context, $attributes = []): EntityValidationResult {
		$result = $this->createPrimaryModel($context, $attributes);

		if (!$result->isSuccess()) return $result;

		$this->createPassword($context);
		$this->createVerification($context);

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

	/**
	 * @param Context|null $context
	 * @throws UnresolvableException
	 */
	protected function createPassword(Context $context = null) {
		$password = $this->properties->password;
		$this->fillPropertyValue($password);
		$password->create($context);
	}

	/**
	 * Create the hash that would verify the user (via link)
	 * @param Context|null $context
	 * @throws UnresolvableException
	 */
	protected function createVerification(Context $context = null) {
		$verification_hash = $this->properties->verification;
		$this->fillPropertyValue($verification_hash);
		$verification_hash->create($context);
	}

	#
	##  Contextualization
	/**
	 * @param Context|null $context
	 * @return EntitySchema|UserEntityProxy
	 * @throws InvalidArgumentException
	 */
	public function proxyInContext(Context $context = null): EntitySchema {
		return new UserEntityProxy($this, $context);
	}
}