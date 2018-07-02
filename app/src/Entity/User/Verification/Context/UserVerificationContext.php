<?php

namespace WANGHORN\Entity\User\Verification\Context;


use Sm\Data\Entity\Context\EntityContext;

class UserVerificationContext extends EntityContext {
	public function __construct(string $context_name = null) { parent::__construct($context_name ?? '::verification'); }

	public static function init(string $context_name = null): UserVerificationContext {
		/** @var UserVerificationContext $entityContext */
		$entityContext = parent::init($context_name);
		return $entityContext;
	}

}