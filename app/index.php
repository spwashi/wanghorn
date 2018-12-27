<?php

use Sm\Application\Application;
use Sm\Communication\Routing\Exception\RouteNotFoundException;
use Sm\Core\Sm\Sm;
use Sm\Modules\Network\Http\Http;
use Sm\Modules\Network\Http\Request\HttpRequest;
use Sm\Modules\Network\Http\Request\HttpRequestFromEnvironment;

require_once __DIR__ . '/_base.php';

/**
 * @param string $url
 *
 * @return string
 */
if (!file_exists(__DIR__ . '/../vendor/autoload.php')) {
  $open_config_anchor     = get_pstorm_link(APP__APP_PATH . 'config/config.js', 'Change the app name, namespace, and url', 12);
  $open_initialize_anchor = get_pstorm_link(APP__APP_PATH . 'scripts/initialize.sh', 'here', 0);
  $config_app_message     = "Configure the application: {$open_config_anchor}";
  $init_app_message       = "Run the initialization script: {$open_initialize_anchor}";
  needs_more_config([$config_app_message, $init_app_message]);
}

require_once __DIR__ . '/../vendor/autoload.php';

# prevents the dispatcher from returning JSON
define('NO_JSON', false);

if (session_status() == PHP_SESSION_NONE) session_start();

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

    /** @var \Sm\Modules\Network\Http\Request\HttpRequestDescriptor $requestDescriptor */
    $requestDescriptor = $primedErrorRoute->getRequestDescriptor();
    $error_url         = $requestDescriptor->asUrlPath(['path' => $originalRequest->getUrlPath()]);
    $errorRequest      = HttpRequest::init()->setParentRequest($originalRequest)->setUrl($error_url);
    $primedErrorRoute  = $error_route->prime($errorRequest);
    $response          = $primedErrorRoute->resolve();
    $dispatchResult    = $communicationLayer->dispatch(Http::class, $response); # Not a redirect
  }
} catch (\Sm\Core\Exception\Exception|\Throwable $exception) {
  if ($app->environmentIs(Application::ENV_DEV)) {
    try {
      $communicationLayer->dispatch(Http::class, $exception);
    } catch (Exception $e) {
      var_dump($e);
    }
  }
  $app->logging->log($exception);
} finally {
  if (isset(Sm::$globals->get['d_lm'])) {
    $log_level = Sm::$globals->get['d_lm'];
    $monitors  = $app->getMonitors();
    switch ($log_level) {
      case 'q':
        $items = $monitors->getAll();
        foreach ($items as $key => $item) {
          if ($item instanceof \Sm\Core\Resolvable\Resolvable) $item = $item->resolve();
          if (strpos($key, 'query') === false) unset($items[$key]);

        }
        $app->logging->log($items, 'monitors/query');
        break;
      default:
        $monitor_array = [];
        foreach ($monitors->getAll() as $name => $monitor) $monitor_array[$name] = $monitor instanceof \Sm\Core\Resolvable\Resolvable ? $monitor->resolve() : $monitor;

        $app->logging->log($monitor_array, 'monitors/monitors');
        break;
    }
  }
  die; /* terminate the script */
}