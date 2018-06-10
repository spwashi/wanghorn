<?php
/**
 * Created by PhpStorm.
 * User: sam
 * Date: 6/10/18
 * Time: 11:48 AM
 */


namespace WANGHORN\Entity\User\Verification\Response;

class UserVerificationStatusResponse extends \WANGHORN\Response\StatusResponse {
	protected $is_expired;
	protected $status = null;

	public function setIsExpired($is_expired) {
		$this->is_expired = $is_expired;

		if (isset($this->status)) {
			$this->status = $this->status && !$is_expired;
		} else {
			$this->status = !$is_expired;
		}

		if ($is_expired) {
			$this->message = 'Verification link has expired';
		}
		return $this;
	}

	public function jsonSerialize() {
		$response = parent::jsonSerialize();

		if ($this->status === true) {
			$response['message'] = 'Verification link is valid';
		}

		return $response;
	}
}