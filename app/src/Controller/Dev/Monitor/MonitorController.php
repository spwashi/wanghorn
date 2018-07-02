<?php

namespace WANGHORN\Controller\Dev\Monitor;


use WANGHORN\Controller\Dev\DevController;
class MonitorController extends DevController {
	public function index() {
		return json_decode(json_encode($this->app->getMonitors()), 1);
	}
}