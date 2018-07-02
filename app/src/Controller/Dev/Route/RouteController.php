<?php

namespace WANGHORN\Controller\Dev\Route;


use WANGHORN\Controller\Dev\DevController;
class RouteController extends DevController {
	public function index() {
		return $this->app->communication->routing->listRoutes();
	}
}