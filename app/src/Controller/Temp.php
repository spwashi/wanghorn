<?php


namespace WANGHORN\Controller;


use Sm\Application\Controller\BaseApplicationController;

class Temp extends BaseApplicationController {
    public function react_1() {
        $html_filename = EXAMPLE_APP__NAME . '.html';
        return $this->app->representation->render($html_filename);
    }
}