<?php

define('SM_IS_CLI', php_sapi_name() === 'cli');
error_reporting(E_ALL);

const EXAMPLE_APP__APP_PATH    = __DIR__ . '/';
const EXAMPLE_APP__CONFIG_PATH = __DIR__ . '/config/';

use Sm\Application\Application;
use Sm\Communication\Network\Http\Http;
use Sm\Communication\Network\Http\Request\HttpRequestFromEnvironment;
use Sm\Communication\Request\Request;
use Sm\Communication\Routing\Exception\RouteNotFoundException;

require_once 'vendor/autoload.php';

/** @var Application $app */
$app = Application::init(EXAMPLE_APP__APP_PATH, EXAMPLE_APP__CONFIG_PATH);

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
        
        ###- Create and dispatch the error response -###
        
        $error_route      = $communicationLayer->getRoute('404');
        $primedErrorRoute = $error_route->prime(Request::init()->setParentRequest($originalRequest),
                                                [ 'path' => $originalRequest->getUrlPath() ]);
        $communicationLayer->dispatch(Http::REDIRECT, $primedErrorRoute, false);
        
    }
    
    #
    
} catch (\Sm\Core\Exception\Exception $exception) {
    \Kint::dump($exception);
} catch (\Exception $exception) {
    echo '<pre>';
    print_r($exception);
    echo '</pre>';
} finally {
    
    #-- terminate the script
    
    die;
}

