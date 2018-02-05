<?php

namespace WANGHORN\Controller\Home;

use Sm\Application\Controller\BaseApplicationController;
use Sm\Data\Model\Model;

/**
 * Class Home
 *
 * The controller that contains the core of the application logic.
 */
class Home extends BaseApplicationController {
    public function index() {
        $html_filename = EXAMPLE_APP__NAME . '.html';
        return $this->app->representation->render($html_filename);
    }
    public function test() {
        $application         = $this->app;
        $representationLayer = $application->representation;
        $dataLayer           = $application->data;
        
        $model_manager = $dataLayer->getDataManager(Model::class);
        var_dump($model_manager);
        
        # -- rendering
        
        $vars     = [ 'path_to_site' => $this->app->path, ];
        $rendered = $representationLayer->render('hello.twig', $vars);
        
        #
        
        return $rendered;
    }
}