<?php
/**
 * Created by PhpStorm.
 * User: sam
 * Date: 6/10/18
 * Time: 12:09 PM
 */

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