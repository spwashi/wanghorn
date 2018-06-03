<?php

namespace WANGHORN\Controller;

use Sm\Application\Controller\BaseApplicationController;
use Sm\Modules\Network\Http\Http;
use Sm\Modules\Network\Http\Request\HttpRequestDescriptor;

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
    
    public function routeAsLink($route_name, $parameters = []) {
        $requestDescriptor = $this->app->communication->getRoute($route_name)->getRequestDescriptor();
        if ($requestDescriptor instanceof HttpRequestDescriptor) {
            $link = APP__URL__ROOT . $requestDescriptor->asUrlPath($parameters);
        }
        return $link ?? null;
    }
}