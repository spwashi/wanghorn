<?php

define('SM_IS_CLI', php_sapi_name() === 'cli');
error_reporting(E_ALL);

const APP__APP_PATH            = __DIR__ . '/';
const DEFAULT_APP__CONFIG_PATH = __DIR__ . '/config/';
const DEFAULT_APP__LOG_PATH    = __DIR__ . '/../log/';

use Sm\Application\Application;
use Sm\Communication\Routing\Exception\RouteNotFoundException;
use Sm\Modules\Network\Http\Http;
use Sm\Modules\Network\Http\Request\HttpRequest;
use Sm\Modules\Network\Http\Request\HttpRequestFromEnvironment;

require_once __DIR__ . '/../vendor/autoload.php';

/** @var Application $app */
$app = Application::init(APP__APP_PATH, DEFAULT_APP__CONFIG_PATH, DEFAULT_APP__LOG_PATH);

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
        $error_route      = $communicationLayer->getRoute('error-404');
        $primedErrorRoute = $error_route->prime(null, [ 'path' => $originalRequest->getUrlPath() ]);
        $error_url        = $primedErrorRoute->getRequestDescriptor()
                                             ->asUrlPath([ 'path' => $originalRequest->getUrlPath() ]);
        $errorRequest     = HttpRequest::init()
                                       ->setParentRequest($originalRequest)
                                       ->setUrl($error_url);
        $primedErrorRoute = $error_route->prime($errorRequest);
        $response         = $primedErrorRoute->resolve();
        $dispatchResult   = $communicationLayer->dispatch(Http::class, $response); # Not a redirect
    }
} catch (\Sm\Core\Exception\Exception $exception) {
    if ($app->environmentIs(Application::ENV_DEV)) {
        try{
            $error = json_encode([
                                 $exception->getMessage(),
                                 $exception->getPrevious(),
                                 $exception->getMonitorContainer(),
                                 $exception,
                             ]);
            header('Content-Type: application/json');
            echo $error;
        }catch (Exception $e){
            var_dump($e);
        }
    }
    $app->logging->log([
                           $exception->getMessage(),
                           $exception->getPrevious(),
                           $exception->getMonitorContainer(),
                           $exception,
                       ], 'sm_exception');
} catch (\Throwable $exception) {
    if ($app->environmentIs(Application::ENV_DEV)) {
        header('Content-Type: application/json');
        echo json_encode([
                             $exception->getMessage(),
                             $exception->getPrevious(),
                             $exception,
                         ]);
    }
    $app->logging->log([
                           $exception->getMessage(),
                           $exception->getPrevious(),
                           $exception,
                       ], 'exception');
} finally {
    if (isset($_GET['d_lm'])) {
        $app->logging->log($app->getMonitors(), 'monitors');
    }
    die; /* terminate the script */
}