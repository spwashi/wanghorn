<?php


namespace WANGHORN\Response;

/**
 * Class ApiResponse
 * @package WANGHORN\Response
 *
 * @property-read $status
 * @property-read $message
 * @property-read $action
 */
class ApiResponse implements \JsonSerializable {
	protected $action;
	protected $message;
	protected $status;

	public function __construct($success = null, $message = null, $action = null) {
		$this->status  = $success;
		$this->message = $message;
		$this->action  = $action;
	}
	public function __get($name) {
		return $this->$name ?? null;
	}
	public function setStatus($status = true) {
		$this->status = $status;
		return $this;
	}

	public function setMessage($message) {
		$this->message = $message;
		return $this;
	}

	public function jsonSerialize() {
		$callback = function ($item) { return isset($item); };
		$return   = ['success' => $this->status,
		             'message' => $this->message,
		             'action'  => $this->action];
		return array_filter($return, $callback);
	}
}