<?php


namespace WANGHORN\Controller\Entity;


use Sm\Application\Application;
use WANGHORN\Controller\AppController;

class EntityController extends AppController {
	public function create($entity_name) {
		switch ($entity_name) {
			case 'image':
				return $this->app->controller->createControllerResolvable('Entity\\Image\\Image@create')->resolve();
			case 'event':
				return $this->app->controller->createControllerResolvable('Event\\Event@create')->resolve();
			case 'user':
				return $this->app->controller->createControllerResolvable('User\\User@create')->resolve();
		}
		$message = ['_message' => "Oops! Can't create this kind of entity yet."];
		if ($this->app->environmentIs(Application::ENV_DEV)) {
			$message[] = $entity_name;
		}
		return [
			'success' => false,
			'message' => $message,
		];
	}

	public function createBatch($entity_name) {
		return [
			'success' => false,
			'message' => ['_message' => 'Unimplemented'],
		];
	}
}