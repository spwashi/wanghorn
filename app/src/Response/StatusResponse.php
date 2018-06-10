<?php
/**
 * Created by PhpStorm.
 * User: sam
 * Date: 6/10/18
 * Time: 11:44 AM
 */

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