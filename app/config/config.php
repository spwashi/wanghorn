<?php

use Sm\Application\Application;
use Sm\Communication\CommunicationLayer;
use Sm\Core\Event\GenericEvent;
use Sm\Core\Resolvable\Exception\UnresolvableException;
use Sm\Core\Util;
use Sm\Data\Model\StandardModelPersistenceManager;
use Sm\Modules\Communication\Email\EmailCommunicationModule;
use Sm\Modules\Communication\Email\Factory\EmailFactory;
use Sm\Modules\Communication\Email\Gmail;
use Sm\Modules\Query\MySql\Authentication\MySqlAuthentication;
use Sm\Modules\Query\MySql\MySqlQueryModule;
use Sm\Modules\View\PlainFile\PlainFileViewModule;
use Sm\Modules\View\Twig\TwigViewModule;
use WANGHORN\Datatype\DatatypeFactory;


####################################################################################
#####              APPLICATION CONSTANTS                                     #######
####################################################################################
require_once APP__CONFIG_PATH . 'autoload.php';
const CONFIG_FILE          = APP__CONFIG_PATH . 'out/config.json';
const CONNECTION_INFO_FILE = APP__CONFIG_PATH . 'out/connect.json';
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
const APP__VIEW_TWIG_PATH   = APP__APP_PATH . 'view/twig/';
const APP__FILE_UPLOAD_PATH = APP__APP_PATH . '../_files_';
const APP__SRC_PATH         = APP__APP_PATH . 'src/';
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


function _query_layer(Application $app): void {
	$queryModule = new MySqlQueryModule;
	$app->registerDefaultQueryModule($queryModule);
	if (file_exists(CONNECTION_INFO_FILE)) {
		$json_string = file_get_contents(CONNECTION_INFO_FILE);
		$config      = json_decode($json_string, true);
		$database    = $config['database']['std'];
		$queryModule->registerAuthentication(MySqlAuthentication::init()
		                                                        ->setCredentials($database['username'] ?? null,
		                                                                         $database['password'] ?? null,
		                                                                         $database['host'] ?? null,
		                                                                         $database['database'] ?? null));
	}
}

function _controller_layer(Application $app): void {
	$controllerNamespace = APP__NAMESPACE . '\\Controller\\';
	$app->controller->addControllerNamespace($controllerNamespace);
}

function _communication_layer(Application $app): void {
	$app_events = [];

	$json_path = APP__CONFIG_PATH . 'out/routes.json';
	$php_path  = APP__CONFIG_PATH . 'routes/routes.php';
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


	$authentication_path = APP__CONFIG_PATH . 'out/connect.json';
	if (file_exists($authentication_path)) {
		$authentications = json_decode(file_get_contents($authentication_path), 1);
		$emailFactory    = new EmailFactory();
		$module          = new EmailCommunicationModule($emailFactory);
		$module->registerEmailCreator(function () use ($authentications) {
			$std = $authentications['email']['std'];
			return new \Sm\Modules\Communication\Email\Mock\MockEmail($std['username'] ?? null, $std['password'] ?? null);
		});
		$app->communication->registerModule($module, CommunicationLayer::MODULE_EMAIL);
	} else {
		$app_events[] = GenericEvent::init('FAILED LOADING EMAIL', $json_path);
	}
}

/**
 * @param \Sm\Application\Application $app
 *
 * @throws \Sm\Core\Factory\Exception\FactoryCannotBuildException
 * @throws \Sm\Core\SmEntity\Exception\InvalidConfigurationException
 */
function _data_layer(Application $app): void {
	$model_json_path  = "{$app->config_path}out/models.json";
	$entity_json_path = "{$app->config_path}out/entities.json";

	if (file_exists($model_json_path)) {
		$model_json   = file_get_contents($model_json_path);
		$model_config = json_decode($model_json, 1);
		$app->data->configure($model_config);
	}
	if (file_exists($entity_json_path)) {
		$entity_json   = file_get_contents($entity_json_path);
		$entity_config = json_decode($entity_json, 1);
		$app->data->configure($entity_config);
	}

	/** @var \Sm\Data\Model\ModelDataManager $modelDataManager */
	$modelDataManager    = $app->data->models;
	$entityDataManager   = $app->data->entities;
	$propertyDataManager = $app->data->models->getPropertyDataManager();

	$datatypeFactory    = DatatypeFactory::init()->setDataLayer($app->data);
	$queryModule        = $app->query->getQueryModule();
	$modelFactory       = $modelDataManager->getSmEntityFactory();
	$persistenceManager = (new StandardModelPersistenceManager($modelFactory))->setQueryInterpreter($queryModule);
	$modelDataManager->setPersistenceManager($persistenceManager);

	$app->data->properties->setDatatypeFactory($datatypeFactory);
	$app->data->entityProperties->setDatatypeFactory($datatypeFactory);

	$app->data->properties->registerResolver(function (string $smID, $schematic = null) use ($app) {
		$smID = str_replace(' ', '', $smID);
		switch ($smID) {
			default:
				$property = new \WANGHORN\Model\Property;
				return $property;
		}
	});
	$app->data->models->registerResolver(function (string $smID) use ($propertyDataManager) {
		switch ($smID) {
			case '[Model]user':
				return new \WANGHORN\Model\User($propertyDataManager);
			default:
				return new \WANGHORN\Model\Model($propertyDataManager);
		}
	});
	$app->data->entities->registerResolver(function (string $smID) use ($entityDataManager) {
		switch ($smID) {
			case '[Entity]user':
				return new \WANGHORN\Entity\User\User($entityDataManager);
			case '[Entity]event':
				return new \WANGHORN\Entity\Event\Event($entityDataManager);
			case '[Entity]password':
				return new \WANGHORN\Entity\Password\Password($entityDataManager);
			case '[Entity]verification':
				return new \WANGHORN\Entity\User\Verification\UserVerification($entityDataManager);
			default:
				throw new UnresolvableException("Cannot initialize $smID");
		}
	});
}

function _representation_layer(Application $app): void {

	# This is a module that will allow us to reference files we want to represent as Views as they literally exist.
	#   We'd ideally use this for returning pre - generated HTML or static JSON
	$plainFileModule = new PlainFileViewModule;

	# Assume that we are going to use HTML files and they are typically going to be stored in the public directory
	$HTML__PUBLIC_PATH = APP__PUBLIC_PATH__LOCAL . '/html/';
	$plainFileModule->registerSearchDirectories([$HTML__PUBLIC_PATH]);
	$app->representation->registerModule($plainFileModule);


	# Register the Twig representation
	$twig__Loader_Filesystem = new Twig_Loader_Filesystem([APP__VIEW_TWIG_PATH, $HTML__PUBLIC_PATH]);
	$twig__Environment       = new Twig_Environment($twig__Loader_Filesystem);

	$twig__Environment->addGlobal('app_path__public', APP__PUBLIC_URL);
	$twigViewModule = new TwigViewModule($twig__Environment);
	$app->representation->registerModule($twigViewModule);
}