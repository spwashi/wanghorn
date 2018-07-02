<?php

namespace WANGHORN\Response;


class StatusResponse extends ApiResponse {
	public function jsonSerialize() {
		$callback = function ($item) { return isset($item); };
		$return   = ['status'  => $this->status,
		             'message' => $this->message,
		             'action'  => $this->action];
		return array_filter($return, $callback);
	}
}