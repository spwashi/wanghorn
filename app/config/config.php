<?php

use Sm\Application\Application;
use Sm\Core\Event\GenericEvent;
use Sm\Data\Model\Model;
use Sm\Data\Model\StdModelPersistenceManager;
use Sm\Modules\Sql\MySql\Authentication\MySqlAuthentication;
use Sm\Modules\Sql\MySql\Module\MySqlQueryModule;
use Sm\Representation\Module\PlainFile\PlainFileViewModule;
use Sm\Representation\Module\Twig\TwigViewModule;
use WANGHORN\Model\User;


####################################################################################
#####              APPLICATION CONSTANTS                                     #######
####################################################################################
require_once EXAMPLE_APP__CONFIG_PATH . 'autoload.php';
const CONFIG_FILE = __DIR__ . '/out/config.json';


if (file_exists(CONFIG_FILE)) {
    $json_string        = file_get_contents(CONFIG_FILE);
    $decoded_json_array = json_decode($json_string, true);
    $config             = $decoded_json_array;
} else {
    $config = [
        'env'       => Application::ENV_PROD,
        'name'      => null,
        'url'       => null,
        'namespace' => '\\WANGHORN',
    ];
}
$app->setEnvironment($config['env'] ?? Application::ENV_PROD);
if (!isset($config['name'])) die('No App Name Set');
if (!isset($config['url'])) die('No App URL Set');
if (!isset($config['namespace'])) die('No App namespace Set');

#++sm++ boilerplate
define('EXAMPLE_APP__NAME', $config['name']);
define('EXAMPLE_APP__URL', $config['url']);
define('EXAMPLE_APP__NAMESPACE', $config['namespace']);
const APP__PUBLIC_URL         = EXAMPLE_APP__URL . '/public/';
const APP__SRC_PATH           = EXAMPLE_APP__APP_PATH . 'src/';
const APP__PUBLIC_PATH__LOCAL = EXAMPLE_APP__APP_PATH . '../public/';
const APP__VIEW_TWIG_PATH     = EXAMPLE_APP__APP_PATH . 'view/twig/';
#--sm-- boilerplate


####################################################################################
#####              This is what actually configures the app.                 #######
####################################################################################

/** @var \Sm\Application\Application $app */
if (!isset($app)) die("Cannot configure without an app");

# $config_json = EXAMPLE_APP__CONFIG_PATH . 'out/config.json';
_query_layer($app);
_controller_layer($app);
_communication_layer($app);
_data_layer($app);
_representation_layer($app);
####################################################################################
#####              helper functions                                          #######
####################################################################################


function _getAuth() {
    return MySqlAuthentication::init()
                              ->setCredentials("codozsqq",
                                               "^bzXfxDc!Dl6",
                                               "localhost",
                                               'sm_test');
}

function _query_layer(Application $app): void {
    $app->registerDefaultQueryModule((new MySqlQueryModule)->registerAuthentication(_getAuth()));
}

function _controller_layer(Application $app): void {
    $controllerNamespace = EXAMPLE_APP__NAMESPACE . '\\Controller\\';
    $app->controller->addControllerNamespace($controllerNamespace);
}

function _communication_layer(Application $app): void {
    $app_events = [];
    
    $json_path = EXAMPLE_APP__CONFIG_PATH . 'out/routes.json';
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

function _data_layer(Application $app): void {
    $data_json_path = EXAMPLE_APP__CONFIG_PATH . 'out/models.json';
    
    if (file_exists($data_json_path)) {
        $dataJson    = file_get_contents($data_json_path);
        $data_config = json_decode($dataJson, 1);
        $app->data->configure($data_config);
    }
    /** @var \Sm\Data\Model\ModelDataManager $modelDataManager */
    $modelDataManager = $app->data->getDataManager(Model::class);
    $modelDataManager->setPersistenceManager((new StdModelPersistenceManager)->setQueryInterpreter($app->query->getQueryModule(null)));
    
    $app->data->models->registerResolver(function (string $smID) {
        switch ($smID) {
            case '[Model]users':
                return new User;
            default:
                return new \WANGHORN\Model\Model;
        }
        return null;
    });
}

function _representation_layer(Application $app): void {
    
    # This is a module that will allow us to reference files we want to represent as Views as they literally exist.
    #   We'd ideally use this for returning pre-generated HTML or static JSON
    $plainFileModule = new PlainFileViewModule;
    
    # Assume that we are going to use HTML files and they are typically going to be stored in the public directory
    $plainFileModule->registerSearchDirectories([ APP__PUBLIC_PATH__LOCAL . '/html/' ]);
    $app->representation->registerModule($plainFileModule);
    
    
    # Register the Twig representation
    $twig__Loader_Filesystem = new Twig_Loader_Filesystem([ APP__VIEW_TWIG_PATH, ]);
    $twig__Environment       = new Twig_Environment($twig__Loader_Filesystem);
    
    $twig__Environment->addGlobal('app_path__public', APP__PUBLIC_URL);
    $twigViewModule = new TwigViewModule($twig__Environment);
    $app->representation->registerModule($twigViewModule);
}