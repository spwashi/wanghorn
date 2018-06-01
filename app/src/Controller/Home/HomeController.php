<?php

namespace WANGHORN\Controller\Home;

use Sm\Data\Model\Model;
use Sm\Modules\View\Twig\TwigView;
use WANGHORN\Controller\AppController;

/**
 * Class Home
 *
 * The controller that contains the core of the application logic.
 */
class HomeController extends AppController {
    /**
     * @return string
     * @throws \Sm\Core\Exception\UnimplementedError
     * @throws \Sm\Core\Exception\InvalidArgumentException
     */
    public function index() {
        $html_filename = APP__NAME . '.html';
        /** @var \Sm\Data\Entity\EntitySchematic $userSchematic */
        $context_name  = 'signup_process';
        $entityContext = $this->app->controller->createControllerResolvable('User\\User@resolveContext')->resolve($context_name);
        $userProxy     = $this->app->controller->createControllerResolvable('User\\User@findSessionUser')->resolve();
        $tags          = [
            $this->wrapWithScriptTag($entityContext, "context__{$context_name}--configuration"),
            $this->wrapWithScriptTag($userProxy, "session__user"),
        ];
        return $this->app->representation->render(TwigView::class, $html_filename, [ 'inject' => join("\n", array_filter($tags)) ]);
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