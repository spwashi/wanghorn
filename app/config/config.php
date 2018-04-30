<?php

use Sm\Application\Application;
use Sm\Core\Event\GenericEvent;
use Sm\Core\Util;
use Sm\Data\Model\Model;
use Sm\Data\Model\StandardModelPersistenceManager;
use Sm\Modules\Query\MySql\Authentication\MySqlAuthentication;
use Sm\Modules\Query\MySql\MySqlQueryModule;
use Sm\Modules\View\PlainFile\PlainFileViewModule;
use Sm\Modules\View\Twig\TwigViewModule;
use WANGHORN\Model\User;


####################################################################################
#####              APPLICATION CONSTANTS                                     #######
####################################################################################
require_once DEFAULT_APP__CONFIG_PATH . 'autoload.php';
const CONFIG_FILE          = DEFAULT_APP__CONFIG_PATH . 'out/config.json';
const CONNECTION_INFO_FILE = DEFAULT_APP__CONFIG_PATH . 'out/connect.json';
$_required_ci_app = [];

if (file_exists(CONFIG_FILE)) {
    $json_string        = file_get_contents(CONFIG_FILE);
    $decoded_json_array = json_decode($json_string, true);
    $config             = $decoded_json_array;
}

$default = [
    'env'       => Application::ENV_PROD,
    'name'      => 'Wanghorn',
    'namespace' => '\\WANGHORN',
    'urls'      => [
        'base'   => null,
        'public' => '/public/',
    ],
    'paths'     => [
        'public' => APP__APP_PATH . '../public/',
    ],
];
$config  = $config ?? [];
$config  = Util::arrayMergeRecursive($default, $config);
$app->setEnvironment($config['env']);

#++sm++ boilerplate
define('APP__NAME', $config['name']);
define('APP__NAMESPACE', $config['namespace']);
define('APP__URL', $config['urls']['base'] ?? 'http://localhost');
define('APP__URL__ROOT', $config['urls']['root'] ?? 'http://localhost');
define('APP__PUBLIC_URL', $config['urls']['public'] ?? (APP__URL . '/public'));
define('APP__PUBLIC_PATH__LOCAL', $config['paths']['public'] ?? (APP__APP_PATH . '../public/'));
const APP__VIEW_TWIG_PATH = APP__APP_PATH . 'view/twig/';
const APP__SRC_PATH       = APP__APP_PATH . 'src/';
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
    
}

function _query_layer(Application $app): void {
    $queryModule = new MySqlQueryModule;
    $app->registerDefaultQueryModule($queryModule);
    if (file_exists(CONNECTION_INFO_FILE)) {
        $json_string = file_get_contents(CONNECTION_INFO_FILE);
        $config      = json_decode($json_string, true);
        $queryModule->registerAuthentication(MySqlAuthentication::init()
                                                                ->setCredentials($config['std']['username'] ?? null,
                                                                                 $config['std']['password'] ?? null,
                                                                                 $config['std']['host'] ?? null,
                                                                                 $config['std']['database'] ?? null));
    }
}

function _controller_layer(Application $app): void {
    $controllerNamespace = APP__NAMESPACE . '\\Controller\\';
    $app->controller->addControllerNamespace($controllerNamespace);
}

function _communication_layer(Application $app): void {
    $app_events = [];
    
    $json_path = DEFAULT_APP__CONFIG_PATH . 'out/routes.json';
    $php_path  = DEFAULT_APP__CONFIG_PATH . 'routes/routes.php';
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

/**
 * @param \Sm\Application\Application $app
 *
 * @throws \Sm\Core\Exception\InvalidArgumentException
 * @throws \Sm\Core\Factory\Exception\FactoryCannotBuildException
 * @throws \Sm\Core\SmEntity\Exception\InvalidConfigurationException
 */
function _data_layer(Application $app): void {
    $data_json_path = DEFAULT_APP__CONFIG_PATH . 'out/models.json';
    if (file_exists($data_json_path)) {
        $dataJson    = file_get_contents($data_json_path);
        $data_config = json_decode($dataJson, 1);
        $app->data->configure($data_config);
    }
    /** @var \Sm\Data\Model\ModelDataManager $modelDataManager */
    $modelDataManager   = $app->data->getDataManager(Model::class);
    $queryModule        = $app->query->getQueryModule();
    $persistenceManager = new StandardModelPersistenceManager;
    $persistenceManager->setQueryInterpreter($queryModule);
    $modelDataManager->setPersistenceManager($persistenceManager);
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