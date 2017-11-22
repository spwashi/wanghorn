<?php

use Sm\Application\Application;
use Sm\Core\Event\GenericEvent;
use Sm\Representation\Module\Twig\TwigViewModule;


####################################################################################
#####              APPLICATION CONSTANTS                                     #######
####################################################################################
require_once EXAMPLE_APP__CONFIG_PATH . 'autoload/autoload.php';
const EXAMPLE_APP__URL            = 'http://localhost/wanghorn/';
const EXAMPLE_APP__URL_PUBLIC     = EXAMPLE_APP__URL . 'public/';
const EXAMPLE_APP__SRC_PATH       = EXAMPLE_APP__PATH . 'src/';
const EXAMPLE_APP__PUBLIC_PATH    = EXAMPLE_APP__PATH . '../public/';
const EXAMPLE_APP__VIEW_TWIG_PATH = EXAMPLE_APP__PATH . 'view/twig/';

####################################################################################
#####              This is what actually configures the app.                 #######
####################################################################################

/** @var \Sm\Application\Application $app */
if (!isset($app)) die("Cannot configure without an app");

$config_json = EXAMPLE_APP__CONFIG_PATH . '_generated/_config.json';

_controller_layer($app);
_communication_layer($app);
_data_layer($app, $config_json);
_representation_layer($app);

####################################################################################
#####              helper functions                                          #######
####################################################################################


function _controller_layer(Application $app): void {
    $app->controller->addControllerNamespace('\\EXAMPLE_APP_NAMESPACE\\Controller\\');
}

function _communication_layer(Application $app): void {
    $app_events = [];
    
    $json_path = EXAMPLE_APP__CONFIG_PATH . 'routes/routes.json';
    $php_path  = EXAMPLE_APP__CONFIG_PATH . 'routes/routes.php';
    if (file_exists($json_path)) {
        $json_routes = file_get_contents($json_path);
        $app->communication->registerRoutes($json_routes);
    } else {
        $app_events[] = GenericEvent::init('FAILED LOADING ROUTES', $json_path);
    }
    
    if (file_exists($php_path)) {
        $php_routes = include $php_path;
        $app->communication->registerRoutes($php_routes);
    } else {
        $app_events[] = GenericEvent::init('FAILED LOADING ROUTES', $php_path);
    }
    $app->getMonitor('info')->append(...$app_events);
}

function _data_layer(Application $app, $config_json): void {
    $data_json_path = EXAMPLE_APP__CONFIG_PATH . '_generated/_entities.json';
    
    if (file_exists($config_json)) {
        $dataJson    = file_get_contents($data_json_path);
        $data_config = json_decode($dataJson, 1);
        $app->data->configure($data_config);
    }
}

function _representation_layer(Application $app): void {
    $twig__Loader_Filesystem = new Twig_Loader_Filesystem([EXAMPLE_APP__VIEW_TWIG_PATH,]);
    $twig__Environment       = new Twig_Environment($twig__Loader_Filesystem);
    
    $twig__Environment->addGlobal('app_path__public', EXAMPLE_APP__URL_PUBLIC);
    
    $twigViewModule = new TwigViewModule($twig__Environment);
    $app->representation->registerModule($twigViewModule);
}

