<?php

define('SM_IS_CLI', php_sapi_name() === 'cli');
error_reporting(E_ALL);

const APP__APP_PATH    = __DIR__ . '/';
const APP__CONFIG_PATH = __DIR__ . '/config/';

use Sm\Application\Application;
use Sm\Communication\Network\Http\Http;
use Sm\Communication\Network\Http\Request\HttpRequestFromEnvironment;
use Sm\Communication\Request\Request;
use Sm\Communication\Routing\Exception\RouteNotFoundException;

require_once __DIR__ . '/../vendor/autoload.php';

/** @var Application $app */
$app = Application::init(APP__APP_PATH, APP__CONFIG_PATH);

try {
    
    #   - Create & Boot the application
    
    $app                = $app->boot();
    $communicationLayer = $app->communication;
    
    /** @var HttpRequestFromEnvironment $originalRequest */
    $originalRequest = $communicationLayer->resolveRequest();
    
    try {
        
        ###- Create and dispatch the response -###
        
        $request        = $originalRequest;
        $route          = $communicationLayer->getRoute($request);
        $response       = $route->resolve();
        $dispatchResult = $communicationLayer->dispatch(Http::class, $response);
        
    } catch (RouteNotFoundException $exception) {
        
        try {###- Create and dispatch the error response -###
            
            $error_route      = $communicationLayer->getRoute('404');
            $primedErrorRoute = $error_route->prime(Request::init()->setParentRequest($originalRequest),
                                                    [ 'path' => $originalRequest->getUrlPath() ]);
            $communicationLayer->dispatch(Http::REDIRECT, $primedErrorRoute, false);
        } catch (\Sm\Core\Exception\Exception $exception) {
            \Kint::dump($exception);
            \Kint::dump($app->getMonitors());
        }
        
    }
    
    #
    
} catch (\Sm\Core\Exception\Exception $exception) {
    
    if ($app->environmentIs(Application::ENV_DEV)) {
        header('Content-Type: application/json');
        echo json_encode([
                             $exception->getMessage(),
                             $exception->getPrevious(),
                             $exception->getMonitorContainer(),
                             $exception,
                         ]);
    }
} catch (\Exception $exception) {
    if ($app->environmentIs(Application::ENV_DEV)) {
        header('Content-Type: application/json');
        echo json_encode([
                             $exception->getMessage(),
                             $exception->getPrevious(),
                             $exception,
                         ]);
    }
} finally {
    
    #-- terminate the script
    
    die;
}

