<?php


namespace EXAMPLE_APP_NAMESPACE\Controller;


use Sm\Application\Controller\BaseApplicationController;

class Temp extends BaseApplicationController {
    public function react_1() {
        $public_html_dir = EXAMPLE_APP__PUBLIC_PATH . '/html/';
        
        $html_filename = EXAMPLE_APP__NAME . '.html';
        return file_get_contents($public_html_dir . $html_filename);
    }
}