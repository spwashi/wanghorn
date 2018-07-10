<?php
use WANGHORN\Config\Config;

require_once __DIR__ . '/Config.php';

$config = $app_config ?? [];

Config::init($app, $config)->run();