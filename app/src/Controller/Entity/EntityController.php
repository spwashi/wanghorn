<?php


namespace WANGHORN\Controller\Entity;


use WANGHORN\Controller\AppController;

class EntityController extends AppController {
    public function create($entity_name) {
        switch ($entity_name) {
            case 'image':
                return $this->app->controller->createControllerResolvable('Entity\\Image\\Image@create')->resolve('create');
            case 'user':
                return $this->app->controller->createControllerResolvable('User\\User@create')->resolve('create');
        }
        return [
            'success' => false,
            'message' => [ '_message' => "Oops! Can't create this kind of entity yet." ],
        ];
    }
    
    public function createBatch($entity_name) {
        return [
            'success' => false,
            'message' => [ '_message' => 'Unimplemented' ],
        ];
    }
}