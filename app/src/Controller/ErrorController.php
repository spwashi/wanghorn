<?php


namespace WANGHORN\Controller;


use Sm\Application\Controller\BaseApplicationController;

class ErrorController extends BaseApplicationController {
    public function rt_404($argument) {
        header('Content-Type: application/json');
        return json_encode($argument);
    }
}