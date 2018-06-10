<?php

namespace WANGHORN\Entity\User\Schema;

use Sm\Core\Context\Context;
use Sm\Data\Entity\Validation\EntityValidationResult;
use Sm\Data\Property\Property;
use Sm\Data\Property\PropertyContainer;
use Sm\Data\Property\PropertySchemaContainer;
use WANGHORN\Entity\User\UserPropertyContainer;


/**
 * Class User
 *
 * @method proxyInContext(Context $context):\WANGHORN\Entity\User\UserSchema
 * @property-read                                                         $authentications
 * @property-read UserPropertyContainer                                   $properties
 */
interface UserEntitySchema {
	public function save($attributes = []);
	public function destroy();
	public function create(Context $context, $attributes = []): EntityValidationResult;
	public function find($attributes = [], Context $context = null);
	public function getProperties();
	public function findPassword(): Property;
	public function findUsername(): Property;
}