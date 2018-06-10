<?php

namespace WANGHORN\Entity\User\Proxy;

use Sm\Core\Context\Context;
use Sm\Data\Entity\Context\ContextualizedEntityProxy;
use Sm\Data\Entity\Validation\EntityValidationResult;
use Sm\Data\Property\Property;
use WANGHORN\Entity\User\Schema\UserEntitySchema;
use WANGHORN\Entity\User\Verification\Context\UserVerificationContext;

class UserEntityProxy extends ContextualizedEntityProxy implements UserEntitySchema {
	public function save($attributes = []) { return $this->__call(__FUNCTION__, func_get_args()); }
	public function destroy() { return $this->__call(__FUNCTION__, func_get_args()); }
	public function create(Context $context, $attributes = []): EntityValidationResult {
		return $this->__call(__FUNCTION__, func_get_args());
	}
	public function find($attributes = [], Context $context = null) { return $this->__call(__FUNCTION__, func_get_args()); }
	public function findPassword(): Property { return $this->__call(__FUNCTION__, func_get_args()); }
	public function findUsername(): Property { return $this->__call(__FUNCTION__, func_get_args()); }
	public function jsonSerialize() {
		$response = parent::jsonSerialize();

		if ($this->context instanceof UserVerificationContext) unset($response['properties']);

		return $response;
	}
}