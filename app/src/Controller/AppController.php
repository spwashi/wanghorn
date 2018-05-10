<?php

namespace WANGHORN\Controller;

use Sm\Application\Controller\BaseApplicationController;

class AppController extends BaseApplicationController {
    const SESSION_USERNAME_INDEX = APP__NAME . '_LOGGED_IN_USERNAME_';
    public function __construct() {
        if (!isset($_SESSION)) {
            session_start();
        }
    }
}