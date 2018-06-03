<?php

namespace WANGHORN\Controller;

use Sm\Application\Controller\BaseApplicationController;
use Sm\Modules\Network\Http\Http;

class AppController extends BaseApplicationController {
    public function __construct() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }
    
    public function redirect($name) {
        return $this->app->communication->dispatch(Http::REDIRECT,
                                                   $this->app->communication->getRoute($name));
    }
}