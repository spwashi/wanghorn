<?php


namespace WANGHORN\Config;


use Sm\Application\Application;
use Sm\Communication\CommunicationLayer;
use Sm\Core\Event\GenericEvent;
use Sm\Core\Resolvable\Exception\UnresolvableException;
use Sm\Core\Util;
use Sm\Data\Model\StandardModelPersistenceManager;
use Sm\Modules\Communication\Email\EmailCommunicationModule;
use Sm\Modules\Communication\Email\Factory\EmailFactory;
use Sm\Modules\Query\MySql\Authentication\MySqlAuthentication;
use Sm\Modules\Query\MySql\MySqlQueryModule;
use Sm\Modules\View\PlainFile\PlainFileViewModule;
use Sm\Modules\View\Twig\TwigViewModule;
use Twig_Environment;
use Twig_Loader_Filesystem;
use WANGHORN\Datatype\DatatypeFactory;
class Config {
    protected $default
        = [
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
    public function __construct(Application $app, array $config) {
        $this->app    = $app;
        $this->config = Util::arrayMergeRecursive($this->default, $config);
    }
    public static function init(Application $application, array $config) {
        return new static($application, $config);
    }
    public function run() {
        $this->defineConstants();
        $this->app->setEnvironment($this->config['env']);
        $this->configureQueryLayer();
        $this->configureControllerLayer();
        $this->configureCommunicationLayer();
        $this->configureDataLayer();
        $this->configureRepresentationLayer();
    }

    protected function defineConstants() {
        if (!defined('APP__NAME')) {
            define('APP__NAME', $this->config['name']);
        }
        if (!defined('APP__NAMESPACE')) {
            define('APP__NAMESPACE', $this->config['namespace']);
        }
        if (!defined('APP__URL')) {
            define('APP__URL', $this->config['urls']['base'] ?? 'http://localhost');
        }
        if (!defined('APP__URL__ROOT')) {
            define('APP__URL__ROOT', $this->config['urls']['root'] ?? 'http://localhost');
        }
        if (!defined('APP__PUBLIC_URL')) {
            define('APP__PUBLIC_URL', $this->config['urls']['public'] ?? (APP__URL . '/public'));
        }
        if (!defined('APP__PUBLIC_PATH__LOCAL')) {
            define('APP__PUBLIC_PATH__LOCAL', $this->config['paths']['public'] ?? (APP__APP_PATH . '../public/'));
        }
        if (!defined('APP__VIEW_TWIG_PATH')) {
            define('APP__VIEW_TWIG_PATH', APP__APP_PATH . 'view/twig/');
        }
        if (!defined('APP__FILE_UPLOAD_PATH')) {
            define('APP__FILE_UPLOAD_PATH', APP__APP_PATH . '../_files_');
        }
        if (!defined('APP__SRC_PATH')) {
            define('APP__SRC_PATH', APP__APP_PATH . 'src/');
        }
    }
    protected function configureQueryLayer(): void {
        $queryModule = new MySqlQueryModule;
        $this->app->registerDefaultQueryModule($queryModule);
        $connect_json = APP__CONFIG_PATH . 'connect.json';

        if (file_exists($connect_json)) {
            $json_string = file_get_contents($connect_json);
            $config      = json_decode($json_string, true);
            $database    = $config['database']['std'];
            $queryModule->registerAuthentication(MySqlAuthentication::init()
                                                                    ->setCredentials($database['username'] ?? null,
                                                                                     $database['password'] ?? null,
                                                                                     $database['host'] ?? null,
                                                                                     $database['database'] ?? null));
        }
    }
    protected function configureControllerLayer(): void {
        $controllerNamespace = APP__NAMESPACE . '\\Controller\\';
        $this->app->controller->addControllerNamespace($controllerNamespace);
    }
    protected function configureCommunicationLayer(): void {
        $json_path = APP__CONFIG_PATH . 'routes.json';

        if (file_exists($json_path)) {
            $json_routes = file_get_contents($json_path);
            $this->app->communication->registerRoutes($json_routes);
        } else {
            $this->app->getMonitor('info')->append(GenericEvent::init('FAILED LOADING ROUTES', $json_path));
        }


        $authentication_path = APP__CONFIG_PATH . 'connect.json';
        if (file_exists($authentication_path)) {
            $authentications = json_decode(file_get_contents($authentication_path), 1);
            $emailFactory    = new EmailFactory();
            $module          = new EmailCommunicationModule($emailFactory);

            $module->registerEmailCreator(function () use ($authentications) {
                $std = $authentications['email']['std'];
                return new \Sm\Modules\Communication\Email\Mock\MockEmail($std['username'] ?? null, $std['password'] ?? null);
            });

            $this->app->communication->registerModule($module, CommunicationLayer::MODULE_EMAIL);
        } else {
            $this->app->getMonitor('info')->append(GenericEvent::init('FAILED LOADING EMAIL', $json_path));
        }
    }
    protected function configureDataLayer(): void {
        $model_json_path  = "{$this->app->config_path}models.json";
        $entity_json_path = "{$this->app->config_path}entities.json";

        if (file_exists($model_json_path)) {
            $model_json   = file_get_contents($model_json_path);
            $model_config = json_decode($model_json, 1);
            $this->app->data->configure($model_config);
        }
        if (file_exists($entity_json_path)) {
            $entity_json   = file_get_contents($entity_json_path);
            $entity_config = json_decode($entity_json, 1);
            $this->app->data->configure($entity_config);
        }

        /** @var \Sm\Data\Model\ModelDataManager $modelDataManager */
        $modelDataManager    = $this->app->data->models;
        $entityDataManager   = $this->app->data->entities;
        $propertyDataManager = $this->app->data->models->getPropertyDataManager();

        $datatypeFactory    = DatatypeFactory::init()->setDataLayer($this->app->data);
        $queryModule        = $this->app->query->getQueryModule();
        $modelFactory       = $modelDataManager->getSmEntityFactory();
        $persistenceManager = (new StandardModelPersistenceManager($modelFactory))->setQueryInterpreter($queryModule);
        $modelDataManager->setPersistenceManager($persistenceManager);

        $this->app->data->properties->setDatatypeFactory($datatypeFactory);
        $this->app->data->entityProperties->setDatatypeFactory($datatypeFactory);

        $this->app->data->properties->registerResolver(function (string $smID, $schematic = null) {
            $smID = str_replace(' ', '', $smID);
            switch ($smID) {
                default:
                    $property = new \WANGHORN\Model\Property;
                    return $property;
            }
        });
        $this->app->data->models->registerResolver(function (string $smID) use ($propertyDataManager) {
            switch ($smID) {
                case '[Model]user':
                    return new \WANGHORN\Model\User($propertyDataManager);
                case '[Model]password':
                    return new \WANGHORN\Model\Password\Password($propertyDataManager);
                default:
                    return new \WANGHORN\Model\Model($propertyDataManager);
            }
        });
        $this->app->data->entities->registerResolver(function (string $smID) use ($entityDataManager) {
            switch ($smID) {
                case '[Entity]user':
                    return new \WANGHORN\Entity\User\User($entityDataManager);
                case '[Entity]event':
                    return new \WANGHORN\Entity\Event\Event($entityDataManager);
                case '[Entity]password':
                    return new \WANGHORN\Entity\Password\Password($entityDataManager);
                case '[Entity]user_role':
                    return new \WANGHORN\Entity\User\Role\UserRole($entityDataManager);
                case '[Entity]verification':
                    return new \WANGHORN\Entity\User\Verification\UserVerification($entityDataManager);
                default:
                    throw new UnresolvableException("Cannot initialize $smID");
            }
        });
    }
    protected function configureRepresentationLayer(): void {

        # This is a module that will allow us to reference files we want to represent as Views as they literally exist.
        #   We'd ideally use this for returning pre - generated HTML or static JSON
        $plainFileModule = new PlainFileViewModule;

        # Assume that we are going to use HTML files and they are typically going to be stored in the public directory
        $HTML__PUBLIC_PATH = APP__PUBLIC_PATH__LOCAL . '/html/';
        $plainFileModule->registerSearchDirectories([$HTML__PUBLIC_PATH]);
        $this->app->representation->registerModule($plainFileModule);


        # Register the Twig representation
        $twig__Loader_Filesystem = new Twig_Loader_Filesystem([APP__VIEW_TWIG_PATH, $HTML__PUBLIC_PATH]);
        $twig__Environment       = new Twig_Environment($twig__Loader_Filesystem);

        $twig__Environment->addGlobal('app_path__public', APP__PUBLIC_URL);
        $twigViewModule = new TwigViewModule($twig__Environment);
        $this->app->representation->registerModule($twigViewModule);
    }
}