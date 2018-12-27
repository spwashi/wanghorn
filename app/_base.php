<?php

define('SM_IS_CLI', php_sapi_name() === 'cli');
error_reporting(E_ALL);
ini_set('display_errors', 1);

const APP__APP_PATH    = __DIR__ . '/';
const APP__CONFIG_PATH = __DIR__ . '/config/out/';
const APP__LOG_PATH    = __DIR__ . '/../log/';

require_once APP__APP_PATH . 'autoload.php';

if (!function_exists("needs_more_config")) {
  function needs_more_config(array $tasks = ['Finish configuring the app']) {
    echo "<div>The application is not done being configured:</div>";

    echo "<div> Please do the following:";

    echo "<ol class='task--container'>";
    foreach ($tasks as $task):
      echo "<li class='task'>$task</li>";
    endforeach;
    echo "</ol>";

    echo "</div>'";

    die;
  }
}

if (!function_exists("get_pstorm_url")) {
  function get_pstorm_url(string $url, $line = 0): string {
    $open_config_in_pstorm_url = "phpstorm://open?url=file://${url}&line={$line}";
    return $open_config_in_pstorm_url;
  }
}