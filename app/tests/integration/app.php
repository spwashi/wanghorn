<?php

use Sm\Application\Application;
require_once __DIR__ . '/../_test_base.php';

function resolveApplication(): Application { return Application::init(APP__APP_PATH, APP__CONFIG_PATH, APP__LOG_PATH)->boot(); }