<?php

namespace WANGHORN\Controller;

use Sm\Application\Controller\BaseApplicationController;

class AppController extends BaseApplicationController {
    public function __construct() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }
}