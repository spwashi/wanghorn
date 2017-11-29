<?php

define('SM_IS_CLI', php_sapi_name() === 'cli');
error_reporting(E_ALL);

const EXAMPLE_APP__NAME        = 'wanghorn';
const EXAMPLE_APP__PATH        = __DIR__ . '/';
const EXAMPLE_APP__CONFIG_PATH = __DIR__ . '/config/';


use Sm\Application\Application;
use Sm\Communication\Network\Http\Http;
use Sm\Communication\Network\Http\Request\HttpRequestFromEnvironment;
use Sm\Communication\Request\NamedRequest;
use Sm\Communication\Routing\Exception\RouteNotFoundException;

require_once 'vendor/autoload.php';

echo 'WOW';


/** @var Application $app */
$app = Application::init('wanghorn',
                         EXAMPLE_APP__PATH,
                         EXAMPLE_APP__CONFIG_PATH);

try {
    #   - Create & Boot the application
    $app = $app->boot();
    
    /** @var HttpRequestFromEnvironment $originalRequest */
    $originalRequest = $app->communication->resolveRequest();
    
    try {
        
        ###- Create and dispatch the response -###
        $request  = $originalRequest;
        $route    = $app->communication->getRoute($request);
        $response = $route->resolve();
        $result   = $app->communication->dispatch(Http::class, $response) ?? null;
        
        die();
    } catch (RouteNotFoundException $exception) {
        
        ###- Create and dispatch the error response -###
        $request     = NamedRequest::init('rt_404')
                                   ->setParentRequest($originalRequest);
        $args        = ['path' => $originalRequest->getUrlPath()];
        $error_route = $app->communication->getRoute($request)
                                          ->prime(null, $args);
        $result      = $app->communication->dispatch(Http::REDIRECT,
                                                     $error_route);
        
        die();
    }
    
    
} catch (\Sm\Core\Exception\Exception $exception) {
    var_dump($exception);
} catch (\Exception $exception) {
    echo '<pre>';
    print_r($exception);
    echo '</pre>';
}