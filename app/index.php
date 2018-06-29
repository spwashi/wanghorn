<?php

define('SM_IS_CLI', php_sapi_name() === 'cli');
error_reporting(E_ALL);
ini_set('display_errors', 1);

const APP__APP_PATH    = __DIR__ . '/';
const APP__CONFIG_PATH = __DIR__ . '/config/';
const APP__LOG_PATH    = __DIR__ . '/../log/';

use Sm\Application\Application;
use Sm\Communication\Routing\Exception\RouteNotFoundException;
use Sm\Modules\Network\Http\Http;
use Sm\Modules\Network\Http\Request\HttpRequest;
use Sm\Modules\Network\Http\Request\HttpRequestFromEnvironment;

require_once __DIR__ . '/../vendor/autoload.php';

# prevents the dispatcher from returning JSON
define('NO_JSON', false);

/** @var Application $app */
$app = Application::init(APP__APP_PATH, APP__CONFIG_PATH, APP__LOG_PATH);

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
		$primedErrorRoute = $error_route->prime(null, ['path' => $originalRequest->getUrlPath()]);
		$error_url        = $primedErrorRoute->getRequestDescriptor()
		                                     ->asUrlPath(['path' => $originalRequest->getUrlPath()]);
		$errorRequest     = HttpRequest::init()
		                               ->setParentRequest($originalRequest)
		                               ->setUrl($error_url);
		$primedErrorRoute = $error_route->prime($errorRequest);
		$response         = $primedErrorRoute->resolve();
		$dispatchResult   = $communicationLayer->dispatch(Http::class, $response); # Not a redirect
	}
} catch (\Sm\Core\Exception\Exception|\Throwable $exception) {
	if ($app->environmentIs(Application::ENV_DEV)) {
		try {
//			header('Content-Type: application/json');
			$communicationLayer->dispatch(Http::class, $exception);
//			echo json_encode(\Sm\Logging\LoggingLayer::convertThrowableToLoggable($exception));
		} catch (Exception $e) {
			var_dump($e);
		}
	}
	$app->logging->log($exception);
} finally {
	if (isset($_GET['d_lm'])) {
		$log_level = $_GET['d_lm'];
		$monitors  = $app->getMonitors();
		switch ($log_level) {
			case 'q':
				$items = $monitors->getAll(true);
				foreach ($items as $key => $item) {

					if (strpos($key, 'query') === false) unset($items[$key]);

				}
				$app->logging->log($items, 'monitors/query');
				break;
			default:
				$app->logging->log($monitors->getAll(true), 'monitors/monitors');
				break;
		}
	}
	die; /* terminate the script */
}