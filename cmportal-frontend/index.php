<?php
use Phalcon\Di\FactoryDefault;
use Phalcon\Mvc\Application;

define('BASE_PATH', dirname(__DIR__));
define('APP_PATH', BASE_PATH . '/app');

// Load Composer autoloader
require BASE_PATH . '/vendor/autoload.php';

try {
    $di = new FactoryDefault();
    
    require APP_PATH . '/config/services.php';
    require APP_PATH . '/config/router.php';
    
    $di->get('loader');
    
    $application = new Application($di);
    $response = $application->handle($_SERVER['REQUEST_URI']);
    $response->send();
} catch (\Exception $e) {
    echo $e->getMessage();
}
