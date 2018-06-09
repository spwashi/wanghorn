<?php


namespace WANGHORN\Controller;

class ApiResponse implements \JsonSerializable {
	protected $action;
	protected $message;
	protected $success;

	public function __construct($success = null, $message = null, $action = null) {
		$this->success = $success;
		$this->message = $message;
		$this->action  = $action;
	}

	public function setSuccess($status = true) {
		$this->success = $status;
		return $this;
	}

	public function setMessage($message) {
		$this->message = $message;
		return $this;
	}

	public function jsonSerialize() {
		return ['success' => $this->success, 'message' => $this->message, 'action' => $this->action];
	}
}