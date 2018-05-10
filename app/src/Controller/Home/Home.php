<?php

namespace WANGHORN\Controller\Home;

use Sm\Application\Controller\BaseApplicationController;
use Sm\Data\Model\Model;
use Sm\Modules\View\Twig\TwigView;

/**
 * Class Home
 *
 * The controller that contains the core of the application logic.
 */
class Home extends BaseApplicationController {
    /**
     * @return string
     * @throws \Sm\Core\Exception\UnimplementedError
     * @throws \Sm\Core\Exception\InvalidArgumentException
     */
    public function index() {
        $html_filename = APP__NAME . '.html';
        /** @var \Sm\Data\Entity\EntitySchematic $userSchematic */
        $context_name  = 'login_process';
        $entityContext = $this->app->controller->createControllerResolvable('User\\User@resolveContext')
                                               ->resolve($context_name);
        $tag           = $this->wrapWithScriptTag($entityContext, "context__{$context_name}--configuration");
        return $this->app->representation->render(TwigView::class, $html_filename, [ 'inject' => $tag ]);
    }
    /**
     * @return string
     * @throws \Sm\Core\Exception\InvalidArgumentException
     * @throws \Sm\Core\Exception\UnimplementedError
     */
    public function test() {
        $application         = $this->app;
        $representationLayer = $application->representation;
        $dataLayer           = $application->data;
        
        /** @var \Sm\Data\Model\ModelDataManager $model_manager */
        $model_manager = $dataLayer->getDataManager(Model::class);
        
        $model = new Model;
        
        $model_manager->persistenceManager->find($model);
        
        # -- rendering
        
        $vars     = [ 'path_to_site' => $this->app->path, ];
        $rendered = $representationLayer->render('hello.twig', $vars);
        
        #
        
        return $rendered;
    }
    public function gallery() {
        $file_get_contents = file_get_contents(__DIR__ . '/projects.json');
        $json_decode       = json_decode($file_get_contents, 1);
        return $json_decode;
    }
    private function wrapWithScriptTag($items, $id = null) {
        if (isset($items)) {
            $encoded = json_encode($items);
            return "<script type='application/json' id='{$id}'>{$encoded}</script>";
        }
        return '';
    }
}