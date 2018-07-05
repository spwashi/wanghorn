<?php

define('SM_IS_CLI', php_sapi_name() === 'cli');
error_reporting(E_ALL);
ini_set('display_errors', 1);

const APP__APP_PATH    = __DIR__ . '/../';
const APP__CONFIG_PATH = __DIR__ . '/_config/';
const APP__LOG_PATH    = __DIR__ . '/_log/';