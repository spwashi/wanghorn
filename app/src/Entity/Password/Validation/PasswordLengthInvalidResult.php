<?php

namespace WANGHORN\Entity\Password\Validation;


use Sm\Data\Entity\Validation\EntityValidationResult;
class PasswordLengthInvalidResult extends EntityValidationResult {
	const PASSWORD__TOO_SHORT = 'TOO SHORT';
	const PASSWORD__TOO_LONG  = 'TOO LONG';
	protected $success = false;
}