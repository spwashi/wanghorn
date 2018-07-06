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

require_once __DIR__ . '/Config.php';

$configuration = new \WANGHORN\Config\Config($app, $app_config ?? []);
$configuration->run();