<?php


namespace WANGHORN\Controller\Error;


use Sm\Application\Controller\BaseApplicationController;

class ErrorController extends BaseApplicationController {
    public function rt_404($argument) {
        if (strpos($argument, '.json')) {
            header('Content-Type: application/json');
        }
        http_response_code(404);
        
        return "Could not find -- " . $argument;
    }
}