<?php

namespace WANGHORN\Entity\User\Verification\Proxy;


use Sm\Data\Entity\Context\ContextualizedEntityProxy;
use WANGHORN\Entity\User\Verification\UserVerification;

class UserVerificationProxy extends ContextualizedEntityProxy {
	/** @var UserVerification $subject */
	protected $subject;

	public function jsonSerialize() {
		$return = parent::jsonSerialize();
		unset($return['properties']);

		if (isset($this->subject)) {
			$jsonSerialize = $this->subject->jsonSerialize();
			return array_merge($return, json_decode(json_encode($jsonSerialize), 1));
		}

		return $return;
	}
}